/**
  * Created by harsha on 4/19/17.
  * json sucks is scala
  */

import java.util

import org.apache.spark._
import org.apache.spark.SparkContext._
import org.json.JSONObject
import org.json.JSONArray
import java.util.HashMap


object FilterUsers{
  def main(args: Array[String]): Unit = {

    val conf = new SparkConf().setAppName("wordCount")
    val sc = new SparkContext(conf)
    var textFile=sc.textFile("file:///Users/harsha/Google Drive/Semester-4/netphlix/data/ratings.csv");
    val header = textFile.first()
    textFile = textFile.filter(row => row != header)

    val movieCounts = textFile.map{ line =>
      val attr = line.split(",")
      (attr(0),(attr(1),attr(2)))
    }.groupByKey().map{case(key,value)=>(key,(value.mkString(",")))}

    movieCounts.saveAsTextFile("file:///Users/harsha/Google Drive/Semester-4/netphlix/output/users1")
  }


}

