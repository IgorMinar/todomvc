window.TodoNewItem = ng.
  Component({
    selector: 'todo-new-item',
    events: ['todoSubmitted'],
    properties: ['inputDisabled :disabled'],
  }).
  View({
    directives: [ng.formDirectives],
    template:
      '<form id="todo-form" (submit)="submitted(newTodo)">' +
        '<input id="new-todo" placeholder="What needs to be done?" [(ng-model)]="newTodo" [disabled]="inputDisabled" autofocus>' +
        '{{newTodo}}' +
      '</form>'
  }).
  Class({
    constructor: [ng.ChangeDetectorRef, function(changeDetectorRef) {
      this.cd = changeDetectorRef;
      this.newTodo = '';
      this.todoSubmitted = new ng.EventEmitter();
    }],

    submitted: function(newTodo) {
      console.log('submitting new todo: ' + newTodo);
      this.todoSubmitted.next(newTodo);
      
      // the ng-model event is fired at the same time as the submit event is fired
      // submit handler executes first and updates the new value
      // then the ng-model event fires but contains the original value that is no longer valid
      setTimeout((function() {
        this.newTodo = '';
      }).bind(this));
    }
  });