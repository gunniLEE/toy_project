import time
from datetime import datetime
import pandas as pd
from elasticsearch import Elasticsearch

from ..config import ESConfig as escfg

# to suppress debug log msg from inside the es
import logging
logging.getLogger('Elasticsearch').disabled = True


class ESapi:
    """e/s 데이터 불러오기
    - output : pandas"""

    def __init__(self, size=10000, ipport=escfg.es_address):
        """size: 원하는 데이터 수(전체 데이터 추출을 원할 경우=10000)"""
        self.es = Elasticsearch(ipport, timeout=30000, verify_certs=False) 
        if (size <= 10000) & (type(size) == int):
            self.size = size
        else:
            raise ValueError("size <= 10000 입력. 전체 데이터 가져오고 싶으면 10000 입력.")

    def _check_data_num(self, index, query):
        body = {
                    'track_total_hits': True,
                    'size': 0,
                    'query': query
                }
        return self.es.search(index=index, body=body)['hits']['total']['value']
        