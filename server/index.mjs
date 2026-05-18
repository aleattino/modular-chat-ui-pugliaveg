import dotenv from 'dotenv';
import express from 'express';
import { Mistral } from '@mistralai/mistralai';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8787;

app.use(express.json({ limit: '5mb' }));

function requireApiKey() {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error('MISTRAL_API_KEY non configurata sul server.');
  }
  return apiKey;
}

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY mancanti sul server.');
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

function pick(row, keys, fallback = '') {
  for (const key of keys) {
    const value = row?.[key];
    if (value !== undefined && value !== null && value !== '') return String(value);
  }
  return fallback;
}

function normalizeVenue(row) {
  const vvfRaw = pick(row, ['v_vf', 'vvf', 'classification']).toLowerCase();
  const vvf = vvfRaw === 'v' ? 'v' : 'vf';
  return {
    name: pick(row, ['name', 'nome']),
    type: pick(row, ['type', 'tipo']),
    type2: pick(row, ['type_2', 'tipo_2']),
    zone: pick(row, ['zone', 'zona']),
    descriptionIt: pick(row, ['description', 'descrizione']),
    descriptionEn: pick(row, ['description_en', 'descrizione_en']),
    tags: pick(row, ['tags', 'tag']),
    website: pick(row, ['website', 'sito_web']),
    mapsLink: pick(row, ['maps_link']),
    verified: pick(row, ['verified', 'verificato'], 'no'),
    partner: pick(row, ['partner'], 'no'),
    vvf,
    classification: vvf === 'v' ? '100% VEGANO' : 'VEGAN-FRIENDLY (non interamente vegano)',
  };
}

function venueToCsvRow(v) {
  return [
    v.name,
    v.type,
    v.type2,
    v.zone,
    v.descriptionIt,
    v.descriptionEn,
    v.tags,
    v.website,
    v.mapsLink,
    v.verified,
    v.partner,
    v.vvf,
    v.classification,
  ].map((x) => `"${String(x ?? '').replace(/"/g, '""')}"`).join(',');
}

async function loadVenues() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from('venues').select('*');
  if (error) throw new Error(`Errore query Supabase: ${error.message}`);
  return (data ?? []).map(normalizeVenue).filter(v => v.name && v.zone);
}

app.get('/api/health', (_req, res) => {
  const hasKey = Boolean(process.env.MISTRAL_API_KEY);
  const hasSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  res.json({ ok: true, mistralKeyConfigured: hasKey, supabaseConfigured: hasSupabase });
});

app.get('/api/venues-data', async (_req, res) => {
  try {
    const venues = await loadVenues();
    const header = 'nome,tipo,tipo_2,zona,descrizione,descrizione_en,tag,sito_web,maps_link,verificato,partner,v_vf,tipo_classificazione';
    const csv = `${header}\n${venues.map(venueToCsvRow).join('\n')}`;
    res.type('text/plain').send(csv);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Errore interno';
    res.status(500).json({ error: message });
  }
});

app.get('/api/venue-details', async (req, res) => {
  try {
    const name = String(req.query.name ?? '').trim();
    if (!name) return res.status(400).json({ error: 'Parametro name mancante.' });

    const venues = await loadVenues();
    const venue = venues.find(v => v.name.toLowerCase() === name.toLowerCase());
    if (!venue) return res.status(404).json({ error: 'Locale non trovato.' });

    res.json({
      description: venue.descriptionIt,
      description_en: venue.descriptionEn,
      tags: venue.tags,
      vvf: venue.vvf,
      verified: venue.verified,
      partner: venue.partner,
      website: venue.website,
      type: venue.type,
      zone: venue.zone,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Errore interno';
    res.status(500).json({ error: message });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = requireApiKey();
    const { messages } = req.body ?? {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Payload non valido: messages richiesto.' });
    }

    const client = new Mistral({ apiKey });
    const streamResponse = await client.chat.stream({
      model: 'mistral-large-latest',
      messages,
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of streamResponse) {
      const content = chunk.data.choices[0]?.delta?.content;
      if (typeof content === 'string' && content) {
        res.write(content);
      }
    }

    res.end();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Errore interno';
    res.status(500).json({ error: message });
  }
});

app.post('/api/title', async (req, res) => {
  try {
    const apiKey = requireApiKey();
    const { prompt, language } = req.body ?? {};
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Payload non valido: prompt richiesto.' });
    }

    const client = new Mistral({ apiKey });
    const response = await client.chat.complete({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.choices?.[0]?.message?.content;
    const fallback = language === 'en' ? 'New Chat' : 'Nuova Chat';
    const title = typeof text === 'string' ? text.replace(/"/g, '').trim() : fallback;

    res.json({ title: title || fallback });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Errore interno';
    res.status(500).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`API server pronto su http://localhost:${PORT}`);
});
