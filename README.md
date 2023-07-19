# babel-plugin-css-compress

Babel plugin for compressing CSS template tags, uses esbuild.

## Example

```js
const color = '#ff1100';

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const classRoot = css`
	color: ${color};
	display: flex;
	flex-direction: column;
`;

const foo = globalStyle`
	.foo {
		color: ${color};
	}
`;
```

<!-- prettier-ignore-start -->

```js
const color = '#ff1100';
const rotate = keyframes`0%{transform:rotate(0)}to{transform:rotate(360deg)}`;
const classRoot = css`color:#f10;display:flex;flex-direction:column`;
const foo = globalStyle`.foo{color:#f10}`;
```

<!-- prettier-ignore-end -->

## Options

- `styleTagNames: string[] | false` - defaults to `['css']`
- `keyframesTagNames: string[] | false` - defaults to `['keyframes']`
- `globalTagNames: string[] | false` - defaults to `false`
