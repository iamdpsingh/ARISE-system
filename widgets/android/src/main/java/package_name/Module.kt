package package_name

/*
  Prevent @bittingz/expo-widgets plugin from generating its default Module.kt
  into app source, which duplicates ExpoWidgetsModule from the dependency.
*/
object AriseWidgetsNoopModule
