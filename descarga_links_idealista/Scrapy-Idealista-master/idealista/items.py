# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class IdealistaItem(scrapy.Item):
    #Matching variables of every flat to be scrapped
    #id_idealista = scrapy.Field()
    link = scrapy.Field()
