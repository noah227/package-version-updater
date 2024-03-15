# package-version-updater

> Update version of package.json
>
> Version written in format `Major.Minor.Patch` or `Major.Minor.Patch-PreRelease.x`
> 

> [中文文档](./README.zh_CN.md)

## Features

* Update version
* Auto commit

## Update Strategy

* If no args specified, version will be processed as `patch+1`, which equals to `pvu --patch 1`

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

## more

- alpha ? 
