# package-version-updater

> Update version of package.json
>
> Version written as [semver](https://semver.org/) described

> [中文文档](./README.zh_CN.md)

## Features

* Update version
* Auto commit

## Update Strategy

* If no args specified, version will be processed as `patch+1`, which equals to `pvu --patch 1`
* Prior version update will reset sub version (e.g. `--minor` for `1.2.1` will result as `1.3.0`)

## Usage

``` shell
pvu --help
```

### Update Major

```
pvu --major
```

> e.g. 1.2.0 -> 2.2.0

### Update Minor

```
pvu --minor
```

> e.g. 1.2.0 -> 1.3.0

### Update Patch

```
pvu --patch
```

> e.g. 1.2.0 -> 1.2.1

### About Locale

> Locale will be automatically detected
> 
> But you can specify it using `--locale`

```shell
pvu --locale <locale>
```

