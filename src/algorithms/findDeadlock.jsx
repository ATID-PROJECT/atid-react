

const checkErrors = (node_to_node, transictions_activity) => {
    //find start point
    
    const start_point = Object.keys(node_to_node).filter((item) => {
        return item.indexOf('custom:start_')!==-1;
    });

    const place_status = {};
    for(var key in Object.keys(node_to_node))
    {
        place_status[ key ] = 0;
    }

    if( start_point.length == 0)
    {
        alert('error');
    }

    place_status[ start_point[0] ] = 1;

    const current_transiction = node_to_node[ start_point[0]];
    auxCheckError( current_transiction, place_status, node_to_node, transictions_activity, true);

}

const auxCheckError = ( current_transiction, place_status, node_to_node, transictions_activity, show_error) =>
{
    
    transictions_activity[current_transiction].forEach((temp_node) => {
        if(place_status[temp_node] != 1 && show_error){
            alert( 'a configuração da rede está inválida.' )
            return;
        }
    })

        const target_node = node_to_node[ current_transiction ];

        if( target_node == undefined )
        {
            alert('existem transições desconectadas a um nó.')
            return;
        }

        target_node.forEach((node) => {
            place_status[ node ] = 1
        })

        target_node.forEach((node) => {
            if( node in node_to_node ) {
                
                node_to_node[ node ].forEach((target_transiction, index, array) => {
                    const show_next_error = (index+1) == array.length;
                    place_status = auxCheckError(target_transiction, place_status, node_to_node, transictions_activity, show_next_error);
                })                    
            }
            else{
                if( node.indexOf('custom:end_')==-1)
                {
                    alert('existe nós não conectados ao fim da rede');
                }
            }
        });

    return place_status;
}

export const deadlockManager = {
    checkErrors,
};