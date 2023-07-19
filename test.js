import { transformAsync } from '@babel/core';
import cssCompressPlugin from './src/index.js';

const source = `
const color = '#ff1100';

const rotate = keyframes\`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
\`;

const classRoot = css\`
	color: \${color};
	border: 1px dotted \${color};
	display: flex;
	flex-direction: column;

	& .bar {
		color: \${color}
	}

	& h1 {
    &:hover {
      animation: \${rotate} 4s infinite;
    }
  }
\`;

const foo = globalStyle\`
	.foo {
		color: \${color};
	}
\`;
`;

const result = await transformAsync(source, {
	plugins: [[cssCompressPlugin, { globalTagNames: ['globalStyle'] }]],
});

console.log(result.code);
