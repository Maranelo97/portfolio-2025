const { writeFile, mkdirSync, existsSync } = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const envDirectory = './src/app/environments';
const targetPath = `${envDirectory}/environment.ts`;

if (!existsSync(envDirectory)) {
  mkdirSync(envDirectory, { recursive: true });
}

const envConfigFile = `export const environment = {
  production: true,
  geminiApiKey: '${process.env['geminiApiKey'] || ''}',
  serviceId: '${process.env['serviceId'] || ''}',
  templateId: '${process.env['templateId'] || ''}',
  authKey: '${process.env['authKey'] || ''}'
};
`;

console.log('Generando archivo en:', targetPath);

console.log('Key cargada:', process.env['geminiApiKey']?.substring(0, 4));

writeFile(targetPath, envConfigFile, function (err: any) {
  if (err) {
    throw err;
  }
  console.log('Archivo generado con éxito.');
});
