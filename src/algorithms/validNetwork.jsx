import * as Driver from 'driver.js';

import 'driver.js/dist/driver.min.css';
var _ = require('lodash');

function clone(obj) {
    return _.cloneDeep(obj);
}

var uuidv4 = function () {
    return '_' + Math.random().toString(36).substr(2, 9);
}

var showError = function ( id ){
    const driver = new Driver();
    const custom_id = uuidv4();

    document.querySelector(`g[data-element-id='${id}'`).setAttribute("id", custom_id);
    
    setTimeout(() => {
       
        driver.highlight({
            element: "#"+custom_id,
            stageBackground: 'transparent',
            popover: {
            title: 'Nó inválido',
            description: 'Esta Transição está associada a caminhos distintos.',
            closeBtnText: 'Fechar',
            },
            onNext: () => {},
            onPrevious: () => {},
        });

    }, 1000);
}

var checkNext = function( current_petri, activity_transiction, transiction_activity, id_names, handleClickVariant ){

    var ids_transictions = new Set();

    for( let id in current_petri) {
        const item = current_petri[ id ];
        if(item.value === 1){
            ids_transictions.add( id );
        }
    }

    for( let id of ids_transictions ){
        if( activity_transiction[ id ] ){
            for(var transiction of activity_transiction[ id ]){
                var temp_result = auxCheckNext( clone( current_petri ), transiction, activity_transiction, transiction_activity, id_names, handleClickVariant);
                if( temp_result === "end")
                {
                    return;
                }
            }
        }
    }
}

var hasError = function(  current_petri ){
    //current_petri = filterByValue2(current_petri, "custom:evento");
    //current_petri = filterByValue2(current_petri, "custom:repositorio");

    for(var item in current_petri){
        item = current_petri[ item ];
        if( item.value === 1){
            return true;
        }
    }
    return false;
}

var filterByValue = function(array, value) {
    return array.filter((data) =>  !(JSON.stringify(data).toLowerCase().indexOf(value.toLowerCase()) !== -1));
  }

var auxCheckNext = function( current_petri, transiction, activity_transiction, transiction_activity, id_names, handleClickVariant) {
    var array_activitys = filterByValue(transiction_activity[ transiction ], "custom:evento");
    array_activitys = filterByValue(array_activitys, "custom:repositorio");

    for( var item of array_activitys) {
        if(current_petri[ item ].value !== 1){
            showError( id_names[transiction]["id"]);
            return "end";
        }
    }

    for( item of array_activitys) {
        current_petri[ item ].value = 0; 
    }

    if( hasError(array_activitys) ){
        showError( id_names[transiction]["id"]);
        return "end";
    }

    if( typeof activity_transiction[ transiction ]  === "undefined"){
        return "end";
    }

    for( const activity of activity_transiction[ transiction ]) {
        current_petri[ activity ].value = 1;
        if(current_petri[ activity ].type === "custom:end" && activity_transiction[ transiction ].length !== 1){
            showError( id_names[transiction]["id"]);
            return "end";
        }
    }

    if( activity_transiction[ transiction ].length === 0 ){
        showError( id_names[transiction]["id"]);
        return "end";
    }

    checkNext(current_petri, activity_transiction, transiction_activity, id_names, handleClickVariant );

}

export const network_petris = {
    checkNext,
    hasError,
    auxCheckNext,
};