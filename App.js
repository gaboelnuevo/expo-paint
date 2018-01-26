import React from 'react';
import { StyleSheet, Text, View, Button, Dimensions, AsyncStorage, ActivityIndicator } from 'react-native';

import RNDraw from 'rn-draw';

const {height, width} = Dimensions.get('window');

export default class App extends React.Component {
  state = {
    strokes: [],
    loading: true,
  }

  componentDidMount(){
    AsyncStorage.getItem('draw')
    .then(draw => {
      let strokes = JSON.parse(draw || []);
      return this.setState({strokes, loading: false});
    }).catch(err => {
      console.log(err);
      this.setState({loading: false});
    })
  }

  _renderToolBar(){
    return (
      <View style={{flexDirection: 'row', flexWrap: 'wrap', marginVertical: 5, justifyContent: 'space-between'}}>
        <View style={{marginHorizontal: 1}}>
          <Button title="Undo" onPress={() => this._undo && this._undo()}/>
        </View>
        <View style={{marginHorizontal: 1}}>
          <Button title="Clear" onPress={() => this._clear && this._clear()}/>
        </View>
        <View style={{marginHorizontal: 1}}>
          <Button title="Save" onPress={() => this._save() }/>
        </View>
      </View>
    )
  }

  _save() {
    if(this.draw){
      window.alert(this.draw.exportToSVG());
    }

    AsyncStorage.setItem('draw', JSON.stringify(this.state.strokes));
  }

  onChangeStrokes(strokes) {
    this.setState({strokes});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 1, width: width}}>
         {
           this.state.loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
           ): (
            <RNDraw
              ref={(draw) => { this.draw = draw; }}
              strokes={this.state.strokes}
              containerStyle={{backgroundColor: 'rgba(0,0,0,0.01)'}}
              rewind={(undo) => {this._undo = undo}}
              clear={(clear) => {this._clear = clear}}
              color={'#000000'}
              strokeWidth={4}
              onChangeStrokes={this.onChangeStrokes.bind(this)}
            />
           )
         }
        </View>
        { this._renderToolBar() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
