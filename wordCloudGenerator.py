import sys
text = sys.argv[1]
picName = sys.argv[2]
from wordcloud import WordCloud, STOPWORDS
wordcloud = WordCloud(width = 1000, height = 500, random_state=1, background_color='black', colormap='Set1', collocations=False, stopwords = STOPWORDS).generate(text)
#plot_cloud(wordcloud)
wordcloud.to_file(picName)
print('data')
sys.stdout.flush()