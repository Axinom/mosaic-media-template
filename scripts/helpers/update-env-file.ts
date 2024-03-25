import { promises as fs } from 'fs';
import { join, resolve } from 'path';

export const updateEnvFile = async (
  variables: Record<string, string>,
): Promise<void> => {
  const envVarPath = resolve(join(process.cwd(), '.env'));
  let envFileContent = await fs.readFile(envVarPath, { encoding: 'utf8' });

  for (const key in variables) {
    if (Object.prototype.hasOwnProperty.call(variables, key)) {
      const searchPatten = new RegExp(`^${key}=.*$`, 'gm');
      const replaceValue = `${key}=${variables[key]}`;

      if (envFileContent.match(searchPatten) !== null) {
        envFileContent = envFileContent.replace(searchPatten, replaceValue);
      } else {
        envFileContent += '\n' + replaceValue;
      }
    }
  }

  await fs.writeFile(envVarPath, envFileContent, 'utf8');
};
