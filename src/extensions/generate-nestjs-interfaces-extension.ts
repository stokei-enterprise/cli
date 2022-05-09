import { exit } from 'process';
import { getBaseProjectSrcPath } from '../constants/paths';
import { GenerateNestJSConfig } from '../interfaces/generate-command.interface';
import { Toolbox } from '../interfaces/toolbox.interface';

module.exports = (toolbox: Toolbox) => {
  toolbox.generateNestJSInterfaces = async ({
    projectName
  }: GenerateNestJSConfig) => {
    const { template } = toolbox;

    try {
      const baseProjectSrcPath = getBaseProjectSrcPath(
        projectName.kebabCasePluralName
      );

      await template.generate({
        template: 'nestjs/src/database/database.module.ts.ejs',
        target: `${baseProjectSrcPath}/database/database.module.ts`,
        props: {
          projectName
        }
      });
    } catch (error) {
      toolbox.print.error(error);
      return exit(0);
    }
  };
};
