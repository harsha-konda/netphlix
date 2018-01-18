class ComputeSimilarity:
    def __init__(self,user_movies,hits,maxHits=10):
        self.user_set=set(user_movies)
        self.user_w=1.0/len(self.user_set)
        self.mapped_hits=self.sort_users(hits,maxHits)

    def sort_users(self,hits,maxHits):
        sim_list=map(self.comp_sim,hits)
        sorted_sim_list=sorted(zip(sim_list,hits),key=lambda x:-x[0])
        return zip(*sorted_sim_list)[1][:min(maxHits,len(sim_list))]

    def comp_sim(self,hit):
        mv_set=set(map(lambda x:x['movie'],hit['movies']))
        sim_score=len(mv_set.intersection(self.user_set))\
                  *self.user_w*1.0/len(mv_set)
        return sim_score