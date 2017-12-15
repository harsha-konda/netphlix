
name := "comcast"
version := "1.0"
scalaVersion := "2.11.8"
val sparkVersion = "2.2.0"




lazy val root = (project in file("."))
	.settings(
		name := "concast",
		version := "1.0.0-SNAPSHOT",
		scalaVersion := "2.11.8",
		libraryDependencies ++= Seq(
			"org.apache.spark" %% "spark-core" % sparkVersion,
			"org.apache.spark" %% "spark-sql" % sparkVersion,
			"org.eclipse.ecf" % "org.json" % "1.0.0.v201011060100"
		)
	)

assemblyMergeStrategy in assembly := {
	case PathList("META-INF", xs @ _*) => MergeStrategy.discard
	case x => MergeStrategy.first
}