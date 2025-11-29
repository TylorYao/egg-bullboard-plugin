// release.config.js

module.exports = {
  branches: [
    {
      name: 'main',
      channel: 'next',
    },
    {
      name: 'v3',
      range: '3.x', // lock to major version 3, forces releases to start at 3.0.0
      channel: 'latest', // publish under npm dist-tag 'latest'
    },
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
        releaseRules: [
          { type: 'feat', release: 'minor' },
          { type: 'fix', release: 'patch' },
          { breaking: true, release: 'major' },
        ],
      },
    ],
    '@semantic-release/release-notes-generator',
    // npm publish plugin
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
      },
    ],
    [
      '@semantic-release/github',
      {
        successComment: false,
        releasedLabels: false,
        failComment: false, // Disable to avoid permission issues
      },
    ],
  ],
};
