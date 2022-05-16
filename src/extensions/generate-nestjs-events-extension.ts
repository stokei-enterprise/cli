import { exit } from 'process';
import { getBaseProjectSrcPath } from '../constants/paths';
import { GenerateNestJSConfig } from '../interfaces/generate-command.interface';
import { Toolbox } from '../interfaces/toolbox.interface';

module.exports = (toolbox: Toolbox) => {
  toolbox.generateNestJSEvents = async ({
    projectName,
    tables
  }: GenerateNestJSConfig) => {
    try {
      const baseProjectSrcPath = getBaseProjectSrcPath(
        projectName.kebabCasePluralName
      );
      const templateEventHandlersPath = `nestjs/src/events/handlers`;
      const templateEventImplementsPath = `nestjs/src/events/implements`;
      const templateEventHandlersTablePath = `${templateEventHandlersPath}/kebab-case-plural-name`;
      const templateEventImplementsTablePath = `${templateEventImplementsPath}/kebab-case-plural-name`;

      await toolbox.template.generate({
        template: `${templateEventHandlersPath}/index.ts.ejs`,
        target: `${baseProjectSrcPath}/events/handlers/index.ts.ejs`,
        props: {
          projectName,
          tables
        }
      });

      tables.forEach(async (table) => {
        const tableEventHandlersPath = `${baseProjectSrcPath}/events/handlers/${table.kebabCasePluralName}`;
        const tableEventImplementsPath = `${baseProjectSrcPath}/events/implements/${table.kebabCasePluralName}`;

        await toolbox.template.generate({
          template: `${templateEventHandlersTablePath}/index.ts.ejs`,
          target: `${tableEventHandlersPath}/index.ts.ejs`,
          props: {
            projectName,
            table
          }
        });
        await toolbox.template.generate({
          template: `${templateEventHandlersTablePath}/created.handler.ts.ejs`,
          target: `${tableEventHandlersPath}/${table.kebabCaseSingularName}-created.handler.ts.ejs`,
          props: {
            projectName,
            table
          }
        });
        await toolbox.template.generate({
          template: `${templateEventHandlersTablePath}/removed.handler.ts.ejs`,
          target: `${tableEventHandlersPath}/${table.kebabCaseSingularName}-removed.handler.ts.ejs`,
          props: {
            projectName,
            table
          }
        });
        await toolbox.template.generate({
          template: `${templateEventHandlersTablePath}/updated.handler.ts.ejs`,
          target: `${tableEventHandlersPath}/${table.kebabCaseSingularName}-updated.handler.ts.ejs`,
          props: {
            projectName,
            table
          }
        });

        await toolbox.template.generate({
          template: `${templateEventImplementsTablePath}/created.event.ts.ejs`,
          target: `${tableEventImplementsPath}/${table.kebabCaseSingularName}-created.event.ts.ejs`,
          props: {
            projectName,
            table
          }
        });
        await toolbox.template.generate({
          template: `${templateEventImplementsTablePath}/removed.event.ts.ejs`,
          target: `${tableEventImplementsPath}/${table.kebabCaseSingularName}-removed.event.ts.ejs`,
          props: {
            projectName,
            table
          }
        });
        await toolbox.template.generate({
          template: `${templateEventImplementsTablePath}/updated.event.ts.ejs`,
          target: `${tableEventImplementsPath}/${table.kebabCaseSingularName}-updated.event.ts.ejs`,
          props: {
            projectName,
            table
          }
        });
      });
    } catch (error) {
      toolbox.print.error(error);
      return exit(0);
    }
  };
};
