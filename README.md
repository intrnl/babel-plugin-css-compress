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
	border: 1px dotted ${color};
	display: flex;
	flex-direction: column;

	& .bar {
		color: ${color}
	}

	& h1 {
    &:hover {
      animation: ${rotate} 4s infinite;
    }
  }
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
const classRoot = css`color:#f10;border:1px dotted #ff1100;display:flex;flex-direction:column;.bar{color:#f10}& h1{&:hover{animation:${rotate} 4s infinite}}`;
const foo = globalStyle`.foo{color:#f10}`;
```

<!-- prettier-ignore-end -->

## Options

- `styleTagNames: string[] | false` - defaults to `['css']`
- `keyframesTagNames: string[] | false` - defaults to `['keyframes']`
- `globalTagNames: string[] | false` - defaults to `false`
