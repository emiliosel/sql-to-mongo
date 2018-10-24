function sayHiTo(name) {
  return `Hi, ${name}`;
}

function migrate(config) {
  const {
    table,
  } = config;

  return table;
}

migrate({
  fromTable: 'articles',
  toCollection: 'articles',
  columns: {
    oldId: {
      type: String,
      from: 'id',
      embed: {
        type: Object,
        fromTable: 'categories',
        columns: {
          name: {
            type: String,
            from: 'title',
          },
        },
      },
    },
  },
});
const message = sayHiTo('Bruno');

console.log(message);

export default function (config) {
  return {
    config,
  };
}
