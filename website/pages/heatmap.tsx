import * as React from 'react';
import { Map, View } from 'ol';
import { Tile as TileLayer } from 'ol/layer';
import { XYZ } from 'ol/source';
import EChartsLayer from 'ol-echarts';

import { getJSON } from '../helper';

interface PageProps {
  chart: any[];
}

interface PageState {
  zoom: number;
  rotation: number;
  center: number[];
}

class Index extends React.Component<PageProps, PageState> {
  private map: any | null;

  private chart: any | null;

  private container: React.RefObject<HTMLDivElement>;

  constructor(props: PageProps, context: any) {
    super(props, context);
    this.state = {
      zoom: 5,
      rotation: 0,
      center: [113.53450137499999, 34.44104525],
    };

    this.container = React.createRef();
    this.map = null;
  }

  componentDidMount() {
    if (this.container.current) {
      this.map = new Map({
        target: this.container.current,
        view: new View({
          ...this.state,
          projection: 'EPSG:4326',
        }),
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnline'
                + 'StreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
            }),
          }),
        ],
      });
      getJSON('./static/json/heatmap.json', (response: {
        attr: any[];
        coordinates: any[];
      }) => {
        const convertData = (data: any[]) => {
          const res = [];
          for (let i = 0; i < data.length; i++) {
            const geoCoord = response.coordinates[data[i].name];
            if (geoCoord) {
              res.push(geoCoord.concat(data[i].value));
            }
          }
          return res;
        };
        const option = {
          title: {
            text: '全国主要城市空气质量',
            subtext: 'data from PM25.in',
            sublink: 'http://www.pm25.in',
            left: 'center',
            textStyle: {
              color: '#fff',
            },
          },
          backgroundColor: 'transparent',
          visualMap: {
            min: 0,
            max: 500,
            splitNumber: 5,
            inRange: {
              color: ['#d94e5d', '#eac736', '#50a3ba'].reverse(),
            },
            textStyle: {
              color: '#fff',
            },
          },
          series: [{
            name: 'AQI',
            type: 'heatmap',
            data: convertData(response.attr),
          }],
        };

        this.chart = new EChartsLayer(option, {
          hideOnMoving: true,
          hideOnZooming: true,
        });
        this.chart.appendTo(this.map);
      });
    }
  }

  render() {
    return (<div ref={this.container} className="map-content" />);
  }
}

export default Index;
