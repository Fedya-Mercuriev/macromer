!function(window, $, undefined){
    'use strict';

    class App {

        constructor(){
            this.stack = [];
            this.started = false;
            this.sorted = false;
        }

        use(scope, context){
            scope = App.normalizeScope(scope);

            if(!this.sorted){
                this.stack.sort(function(a, b){
                    if(a.order === b.order){
                        return 0;
                    }
                    return a.order > b.order ? 1 : -1;
                });

                this.sorted = true;
            }

            this.stack
                .filter(stack => scope.some(scope => stack.scope.indexOf(scope) > -1))
                .map(stack => stack.callback.call(this, context, scope));
        }

        bind(scope, callback, order){
            if(order === undefined){
                if(callback === undefined){
                    callback = scope;
                    scope = ['default'];

                }else if(typeof callback === 'number') {
                    order = callback || 0;
                    callback = scope;
                    scope = ['default'];
                }
            }

            if(order === undefined){
                order = 0;
            }

            scope = App.normalizeScope(scope);

            this.stack.push({scope, callback, order});
            this.sorted = false;
        }


        start(){
            if(this.started !== false){
                return;
            }

            this.started = true;

            $(() =>{
                this.use('default');
            });
        }

        static normalizeScope(scope){
            if(typeof scope === 'string'){
                scope = scope.split(' ').map(scope => scope.trim());
            }

            if(scope.length === 0){
                scope = ['default'];
            }

            return scope;
        }
    }

    window.app = new App;

}(window, jQuery);

