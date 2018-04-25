import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { isObject } from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public myStyle = {};
  public myParams = {};

  public smartContract = '';

  public deployDisabled = false;
  public deployError = '';
  public deployedAddress = '';

  public actionDisabled = false;

  public wallet1 = '';
  public actionType = '';
  public actionValue = '';
  public actionResult = '';

  public wallets = [
    '0x61fbaef29eCFA323B9A14b7a3089806a5162afE9',
    '0x4191fa8F6459aa70296aa3fb844eBDa2f27005D7',
    '0x3F2225A1492fC01631dAD1835841bD330f1ecD31'
  ];

  public actionTypes = [
    'getBalance',
    'setOffspring',
    'getOffspring',
    'setBlocksTillWill',
    'getBlocksTillWill',
    'getMoneyBags',
    'getLastActiveBlock',
    'performLastWill',
    'bringMeToLife',
    'emptyMoneyBag'
  ];

  public constructor(private http: HttpClient) {
  }

  public clickDeploy() {
    this.deployDisabled = true;
    this.deployError = '';
    this.http.get('http://localhost:3000/api/deploy').subscribe((data) => {
      this.deployDisabled = false;
      this.deployedAddress = data['deployedAddress'];
      // console.log(data);
    }, (error) => {
      this.deployDisabled = false;
      this.deployedAddress = '';
      this.deployError = error.message;
    });
  }

  public performAction() {
    // console.log(this.wallet1, this.actionType, this.actionValue);

    this.actionDisabled = true;
    this.actionResult = '';

    this.http.get('http://localhost:3000/api/run_action', {params: {
      smart: this.deployedAddress,
      wallet: this.wallet1,
      action: this.actionType,
      value: this.actionValue
    }}).subscribe((data) => {
      this.actionDisabled = false;
      this.actionResult = isObject(data['result'])
        ? 'ok' // JSON.stringify(data['result'])
        : (data['result'] ? data['result'] : 'ok');

      this.wallet1 = '';
      this.actionType = '';
      this.actionValue = '';

      console.log(data);
    }, (error) => {
      this.actionDisabled = false;
      this.actionResult = error.message;
    });
  }

  ngOnInit() {
    this.myStyle = {
      'position': 'fixed',
      'width': '100%',
      'height': '100%',
      'z-index': -1,
      'top': 0,
      'left': 0,
      'right': 0,
      'bottom': 0,
      'background-color': '#457ebd',
    };

    this.myParams = {
      'particles': {
        'number': {
          'value': 100,
          'density': {
            'enable': true,
            'value_area': 1000
          }
        },
        'color': {
          'value': '#ffffff'
        },
        'shape': {
          'type': 'circle',
          'stroke': {
            'width': 0,
            'color': '#000000'
          },
          'polygon': {
            'nb_sides': 5
          },
          'image': {
            'src': 'img/github.svg',
            'width': 100,
            'height': 100
          }
        },
        'opacity': {
          'value': 0.5,
          'random': false,
          'anim': {
            'enable': false,
            'speed': 1,
            'opacity_min': 0.1,
            'sync': false
          }
        },
        'size': {
          'value': 3,
          'random': true,
          'anim': {
            'enable': false,
            'speed': 40,
            'size_min': 0.1,
            'sync': false
          }
        },
        'line_linked': {
          'enable': true,
          'distance': 150,
          'color': '#ffffff',
          'opacity': 0.4,
          'width': 1
        },
        'move': {
          'enable': true,
          'speed': 6,
          'direction': 'none',
          'random': false,
          'straight': false,
          'out_mode': 'out',
          'bounce': false,
          'attract': {
            'enable': false,
            'rotateX': 600,
            'rotateY': 1200
          }
        }
      },
      'interactivity': {
        'detect_on': 'canvas',
        'events': {
          'onhover': {
            'enable': false,
            'mode': 'grab'
          },
          'onclick': {
            'enable': false,
            'mode': 'push'
          },
          'resize': true
        },
        'modes': {
          'grab': {
            'distance': 400,
            'line_linked': {
              'opacity': 1
            }
          },
          'bubble': {
            'distance': 400,
            'size': 40,
            'duration': 2,
            'opacity': 8,
            'speed': 3
          },
          'repulse': {
            'distance': 200,
            'duration': 0.4
          },
          'push': {
            'particles_nb': 4
          },
          'remove': {
            'particles_nb': 2
          }
        }
      },
      'retina_detect': true
    };

    this.http.get('http://localhost:3000/api/get_sm').subscribe(data => this.smartContract = data['smartContract']);
  }
}
