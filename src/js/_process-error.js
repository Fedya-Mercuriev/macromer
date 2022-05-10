!function(){
    function showError(message){
        Layer.alert({content: message});
    }

    function internalError(message){
        showError(message || 'Произошел технический сбой');
    }

    app.errorHandler = function(xhr){
        app.processError(xhr);
    };

    app.processError = function(xhr, {query, request} = {}){
        return new Promise((resolve, reject) =>{
            if ( xhr.statusText == 'abort' ) {
                reject({error: 'abort'});
            }

            const error = xhr.responseJSON.error;

            if(400 === xhr.status){
                if(error.query){
                    if(query){
                        query(error.query);
                    }else{
                        internalError(error.message)
                    }
                }else if(error.request){
                    if(request){
                        request(error.request);
                    }else{
                        internalError(error.message)
                    }
                }else{
                    internalError(error.message)
                }

            }else if(401 === xhr.status){

            }else if([403, 404].includes(xhr.status)){
                const error = xhr.responseJSON.error;
                internalError(error.message);

            }else{
                internalError();
            }

            resolve(error);
        }).catch((response) => {
            console.log(response);
        });
    };
}();
