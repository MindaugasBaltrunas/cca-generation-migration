import { ConfigNotFoundException } from "./errors";
import { ConfigFinder } from "./find-config-file-recursive";


export const findConfigFile = async (): Promise<string> => {
    const configFinder = new ConfigFinder();
    try {
      return await configFinder.findConfig();
    } catch (error) {
      if (error instanceof ConfigNotFoundException) {
        console.error(error.message);
        process.exit(1);
      }
      throw error;
    }
  };