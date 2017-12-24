import org.apache.spark.{SparkConf, SparkContext}

object FilterUsersRatings{
  def main(args: Array[String]): Unit = {

    val conf = new SparkConf().setAppName("wordCount")
    val sc = new SparkContext(conf)
    var textFile=sc.textFile("file:///Users/harsha/Google Drive/Semester-4/netphlix/data/ratings.csv");
    val header = textFile.first()
    textFile = textFile.filter(row => row != header)

    val userReviews = textFile.map{ line =>
      val attr = line.split(",")
      (attr(0),(attr(1),attr(2)))
    }.groupByKey().cache()

    val filteredUserReviews=userReviews.map{case (user,movies) => {
      val fmovies=movies
        .toList
        .filter(_._2.toDouble>4.0)
      (user,fmovies)
    }}
    val movieTF=userReviews.flatMap{case (key,value)=>value}.map(key=>(key._1,1)).reduceByKey(_+_)

    val key_counts=userReviews.count()

    val movieCount=sc.parallelize(Seq(key_counts))


    filteredUserReviews
      .map{case(key,value)=>(key,value.mkString(","))}
      .saveAsTextFile("file:///Users/harsha/Google Drive/Semester-4/netphlix/output/users1")
  }


  def mapOutput(line : String) : (String,List[String])={
    val temp=line.split(",")
    var value : List[String]=List()
    for(i <- 1 to temp.length-1)  value=temp(i) :: value

    (temp(0),value)

  }
  
}