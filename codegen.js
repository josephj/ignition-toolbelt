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
    'src/generated/auth_api/types.ts': {
      schema: './graphql/schemas/auth_api.graphql',
      documents: 'src/graphql/auth_api/*.graphql',
      plugins: ['typescript', 'typescript-operations', ...commonPlugins],
      config: {
        maybeValue: 'T',
        inputMaybeValue: 'T | null',
      },
    },
    'src/generated/ignition/types.ts': {
      schema: './graphql/schemas/ignition.graphql',
      documents: 'src/graphql/ignition/*.graphql',
      plugins: ['typescript', 'typescript-operations', ...commonPlugins],
      config: {
        maybeValue: 'T',
        inputMaybeValue: 'T | null',
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
    'src/generated/dev_api/types.ts': {
      schema: './graphql/schemas/dev_api.graphql',
      documents: 'src/graphql/dev_api/*.graphql',
      plugins: ['typescript', 'typescript-operations', ...commonPlugins],
      config: {
        maybeValue: 'T',
        inputMaybeValue: 'T | null',
      },
    },
    'src/generated/ignition/hooks.ts': {
      schema: './graphql/schemas/ignition.graphql',
      documents: 'src/graphql/ignition/*.graphql',
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
    'src/generated/console/requests.ts': {
      schema: './graphql/schemas/console.graphql',
      documents: 'src/graphql/console/*.graphql',
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
        ...commonPlugins,
      ],
      config: {
        inlineFragmentTypes: 'combine',
        useTypeImports: true,
      },
      preset: 'import-types',
      presetConfig: {
        typesPath: './types',
      },
    },
    // 'ignition-local-hooks': {
    //   schema: `./graphql/schemas/ignition.graphql`,
    //   documents: 'src/pages/**/lib/gql/ignition/*.graphql',
    //   preset: 'near-operation-file',
    //   presetConfig: {
    //     extension: '.ts',
    //     fileName: 'ignition-generated-hooks',
    //     folder: '..',
    //     baseTypesPath: '~@generated/ignition/types',
    //   },
    //   plugins: [
    //     'typescript-operations',
    //     'typescript-react-apollo',
    //     ...commonPlugins,
    //   ],
    //   config: {
    //     inlineFragmentTypes: 'combine',
    //     useTypeImports: true,
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
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
};

module.exports = config;
