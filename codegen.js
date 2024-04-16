const commonPlugins = [
  {
    add: {
      content: ['/* eslint-disable */'],
    },
  },
  {
    add: {
      content: ['/* AUTO-GENERATED FILE. DO NOT EDIT MANUALLY. */'],
    },
  },
];

const config = {
  generates: {
    'src/generated/ignition/types.ts': {
      schema: './graphql/schemas/ignition.graphql',
      documents: [
        'src/graphql/ignition/*.graphql',
        'src/pages/Popup/**/*.graphql',
        'src/pages/Content/**/*.graphql',
        '!src/pages/Content/create-new-account/*.graphql',
      ],
      plugins: ['typescript', 'typescript-operations', ...commonPlugins],
      config: {
        maybeValue: 'T',
        inputMaybeValue: 'T | null',
      },
    },
    'src/generated/ignition/hooks.ts': {
      schema: './graphql/schemas/ignition.graphql',
      documents: [
        'src/graphql/ignition/*.graphql',
        'src/pages/Popup/**/*.graphql',
        'src/pages/Content/**/*.graphql',
        '!src/pages/Content/create-new-account/*.graphql',
      ],
      plugins: ['typescript-react-apollo', ...commonPlugins],
      config: {
        withHooks: true,
        inlineFragmentTypes: 'combine',
        useTypeImports: true,
      },
      preset: 'import-types',
      presetConfig: {
        typesPath: './types',
      },
    },
    'src/generated/console/types.ts': {
      schema: './graphql/schemas/console.graphql',
      documents: 'src/graphql/console/*.graphql',
      plugins: ['typescript', 'typescript-operations', ...commonPlugins],
      config: {
        maybeValue: 'T',
        inputMaybeValue: 'T | null',
      },
    },
    // 'src/generated/console/request.ts': {
    //   schema: './graphql/schemas/console.graphql',
    //   documents: 'src/graphql/console/*.graphql',
    //
    //   plugins: ['typescript-graphql-request', ...commonPlugins],
    //   config: {
    //     inlineFragmentTypes: 'combine',
    //     useTypeImports: true,
    //   },
    //   preset: 'import-types',
    //   presetConfig: {
    //     typesPath: './types',
    //   },
    // },
  },
  config: {
    namingConvention: {
      enumValues: 'change-case-all#upperCase',
    },
    useImplementingTypes: true,
    nonOptionalTypename: true,
  },
  // hooks: {
  //   afterAllFileWrite: ['prettier --write'],
  // },
};

module.exports = config;
