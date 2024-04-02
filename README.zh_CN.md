# package-version-updater

> 更新package.json版本号
>
> 版本号以[semver](https://semver.org/)规范的格式书写

> [EN](./README.md)

## 功能特性

* 版本更新
* 自动commit

## 更新策略

* 如果没有指定任何参数，默认以`patch+1`进行更新，等同于`pvu --patch 1`
* 上层版本更新会重置下层版本，如对版本`1.2.1`使用命令`--minor`结果将是`1.3.0`

## 用法

``` shell
pvu --help
```

### 更新 major

```
pvu --major
```

> e.g. 1.2.0 -> 2.2.0

### 更新 minor

```
pvu --minor
```

> e.g. 1.2.0 -> 1.3.0

### 更新 patch

```
pvu --patch
```

> e.g. 1.2.0 -> 1.2.1

### 关于区域语言指定

> 运行时语言自动检测
> 当然也可以使用`--locale`进行指定

```shell
pvu --locale <locale>
```
