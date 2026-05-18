interface EnvVar {
  key: string;
  required: boolean;
}

const ENV_SCHEMA: EnvVar[] = [
  { key: 'VITE_GOOGLE_MAPS_API_KEY', required: false },
];

export function validateEnv(): string[] {
  const missing: string[] = [];

  for (const v of ENV_SCHEMA) {
    if (!v.required) continue;

    const value = import.meta.env[v.key];

    if (!value) missing.push(v.key);
  }

  if (missing.length > 0) {
    console.error(
      `Variabili d'ambiente mancanti: ${missing.join(', ')}. ` +
      'Consulta .env.example per la configurazione.'
    );
  }

  return missing;
}
