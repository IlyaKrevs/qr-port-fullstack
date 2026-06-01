module.exports = function (plop) {
  plop.setGenerator("component", {
    description: "Создать React.tsx компонент с CSS модулем",
    prompts: [
      {
        type: "input",
        name: "destinationpath",
        message: "Template destination path",
      },
      {
        type: "input",
        name: "fileName",
        message: "Имя компонента:",
      },
    ],
    actions: [
      {
        type: "add",
        path: "{{destinationpath}}/{{fileName}}/{{fileName}}.tsx",
        templateFile: "z_plop-templates/component.tsx.hbs",
      },
      {
        type: "add",
        path: "{{destinationpath}}/{{fileName}}/{{fileName}}.module.css",
        templateFile: "z_plop-templates/component.css.hbs",
      },
    ],
  });
};
