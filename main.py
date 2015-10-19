import cgi
import webapp2
import os
from google.appengine.ext.webapp import template
#from googleapiclient.discovery import build


PROJECT_ID = 'moonhauz-properties'
DATASET = '2015wikimediapagecounts'
TABLE = 'wikimediapagecounts'

class MainPage(webapp2.RequestHandler):

    def get(self):
        template_values = {
            # 'greetings': greetings,
            # 'url': url,
            # 'url_linktext': url_linktext,
        }

        path = os.path.join(os.path.dirname(__file__), 'index.html')
        self.response.out.write(template.render(path, template_values))

    # def post(self):
    #     language = self.request.get('language')
    #     title = self.request.get('title')
    #     request = self.request.get('requests')
    #     content_size = self.request.get('content_size')

    #     data = {'language': 'en',
    #             'title'   : 'Water on Mars',
    #             'requests': 100,
    #             'content_size': 100}

    #     service = build('bigquery', 'v2', http=decorator.http())
    #     # results = service.tabledata().insertAll(projectId = PROJECT_ID,
    #     #                                         datasetId = DATASET,
    #     #                                         tableId = TABLE,
    #     #                                         body=data).execute()
    #     return self.response.out.write(language)
        
app = webapp2.WSGIApplication([
  ('/', MainPage)
], debug=True)
