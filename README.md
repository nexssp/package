# @nexssp/package

- Experimental - alpha stage

Manage multiple packages (now only git and only Nexss Programmer packages)

```sh
nexss pkg add Blender --saveNexss # You can modify code from now in your folder and use it for your project.
nexss pkg init
nexss pkg init Id # Run command init on the Id (installs package)
nexss pkg install Id # installs package (Id cannot exists in the NEXSS_PACKAGES_PATH)
nexss pkg install all # installs all packages
```

## Examples

```sh
nexss pkg add Mouse/Move --_x=10 --_y=200
nexss pkg add Local/Folder
nexss pkg add Keyboard --type="#d" --copyPackage --saveNexss  --forceNexss # --copyPackage to the current folder (you can modify)

```

## Multiplatform

Nexss Programmer packages can have subfolders for differnet platform. `nexss pkg init` will ommit them if the platfrom does not match, so it will not run eg. Windows init commands on Linux machine etc.
