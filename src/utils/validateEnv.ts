export function validateEnvironment(): void {
  const missingVars: string[] = [];

  const requiredVars = [
    'OPENAI_API_KEY',
    'CDP_API_KEY_NAME',
    'CDP_API_KEY_PRIVATE_KEY',
  ];
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    console.error('Error: Required environment variables are not set');
    for (const varName of missingVars) {
      console.error(`${varName}=your_${varName.toLowerCase()}_here`);
    }
    process.exit(1);
  }

  if (!process.env.NETWORK_ID) {
    console.warn(
      'Warning: NETWORK_ID not set, defaulting to base-sepolia testnet',
    );
  }
}
