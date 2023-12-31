<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit56f3e012e37b32b9cda669a95a1516b3
{
    public static $prefixLengthsPsr4 = array (
        'W' => 
        array (
            'Workerman\\' => 10,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Workerman\\' => 
        array (
            0 => __DIR__ . '/..' . '/workerman/workerman',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit56f3e012e37b32b9cda669a95a1516b3::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit56f3e012e37b32b9cda669a95a1516b3::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit56f3e012e37b32b9cda669a95a1516b3::$classMap;

        }, null, ClassLoader::class);
    }
}
