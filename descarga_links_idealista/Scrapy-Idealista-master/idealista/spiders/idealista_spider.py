__author__ = 'David Carrasco'
import csv
import scrapy
from idealista.items import IdealistaItem
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from datetime import datetime


class IdealistaSpider(CrawlSpider):
    name = "idealista"
    allowed_domains = ["idealista.com"]
    ########################################################################
    ###       Add the url to crawl in the start_urls variable           ###
    ########################################################################
    #start_urls = ["https://www.idealista.com/venta-viviendas/leganes/el-carrascal/"]
    #start_urls = ['https://www.idealista.com/alquiler-viviendas/madrid/zona-norte/']

    start_urls = ['https://www.idealista.com/venta-viviendas/barcelona-barcelona/']


    rules = (
            # Filter all the flats paginated by the website following the pattern indicated
            Rule(LinkExtractor(restrict_xpaths=("//a[@class='icon-arrow-right-after']")),
                 callback='parse_flats',
                 follow=True),
        )

    def parse_flats(self, response):

    	# Necessary in order to create the whole link towards the website
        default_url = 'http://idealista.com'

        info_flats_xpath = response.xpath("//*[@class='item-info-container']")

        links = [str(''.join(default_url + link.xpath('a/@href').extract().pop()))
                 for link in info_flats_xpath]

        for flat in zip(links):
            item = IdealistaItem(link=flat[0])
            yield item

    #Overriding parse_start_url to get the first page
    parse_start_url = parse_flats


