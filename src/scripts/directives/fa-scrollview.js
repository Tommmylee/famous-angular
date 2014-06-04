/**
 * @ngdoc directive
 * @name faScrollView
 * @module famous.angular
 * @restrict E
 * @description
 * This directive allows you to specify a {@link https://famo.us/docs/0.1.1/views/Scrollview/ famo.us Scrollview}
 * that will lay out a collection of renderables sequentially in the specified direction
 * and will allow you to scroll through them with mousewheel or touch events.
 *
 * @usage
 * ```html
 * <fa-scroll-view>
 *   <fa-view>
 *     <!-- content -->
 *   </fa-view>
 * </fa-scroll-view>
 * ```

 @example

 Scroll View + Events + ng-repeat
 ---------------------------------
 In the example below, fa-scrollview displays a collection of nested fa-views generated by an ng-repeat directive. 
 In Famous, events are used to move information between widgets (such as Scroll View) and nested views.
 When a nested view needs to trigger higher-order app behavior within another view (such as a widget), the best practice is to pass data via events.

 Input events are captured on surfaces, and it is up the developer to specify where the events will broadcast and receive events by piping.
 To use a scroll view, create a Famous EventHandler on the scope, pipe the surface events to the event handler using fa-pipe-to, and then pipe that event handler to the Scroll View using fa-pipe-from.
 This will enable scrolling by connecting input events from the surfaces to the Scroll View.

* ```javascript
* var EventHandler = $famous['famous/core/EventHandler'];
* $scope.eventHandler = new EventHandler();
*
* $scope.list = [{content: "famous"}, {content: "angular"}, {content: "rocks!"}];
* ```

* ```html
* <fa-scroll-view fa-pipe-from="eventHandler" fa-options="options.myScrollView">
*     <fa-view ng-repeat="item in list">
*        <fa-modifier id="{{'listItem' + $index}}" fa-translate="[0, 0, 0]" fa-size="[300, 300]">
*          <fa-surface fa-pipe-to="eventHandler" fa-size="[undefined, undefined]" fa-background-color="'red'">
*            <div>{{item.content}}</div>
*          </fa-surface>
*        </fa-modifier>
*     </fa-view> 
*  </fa-scroll-view>  
* ```

To specify (optional) configurable options for the Scroll View, pass in an object on the scope.
Notable options include clipSize, which specifies the size of the area in pixels that the ScrollView will display content in, and direction, which specifies whether the nested views will scroll horizontally or vertically (1 is vertical, 0 is horizontal).
A full list of configurable options for Scroll View may be found at https://famo.us/docs/0.2.0/views/Scrollview/.

* ```javascript
* var EventHandler = $famous['famous/core/EventHandler'];
* $scope.eventHandler = new EventHandler();
* $scope.list = [{content: "famous"}, {content: "angular"}, {content: "rocks!"}];
*
* $scope.options = {
*   myScrollView: {
*     clipSize: 568,
*     paginated: true,
*     speedLimit: 5,
*     direction: 1,
*   }
* };
* ```

Scroll View with explicitly created views
-----------------------------------------
In this example below, a scrollview is created with two nested fa-view's, both of which have an fa-index of 0 and 1, respectively.
Fa-index determines the order of which the surfaces appear in the sequential view (scrollView in this case).
If fa-index is declared explicitly, it will override any default order of elements declared in html.
As in the example below, the fa-view with the blue background color appears after the one with the red background because its fa-index is set to 1.
If fa-views are created with an ng-repeat, they are automatically assigned the $index property, unless explicitly set.

The scrollView directive accepts another directive called fa-start-index as an attribute, and this determines which view the scrollView displays by default.
Fa-start-index will not affect the sequential order of the layout; the view with the red background will be layed out first, followed by the view with the blue background.
With this attribute set to 1, the scroll view will display the view with the index of 1, which is the view with the blue background color. 

* ```html
  <fa-scroll-view fa-pipe-from="eventHandler" fa-options="options.scrollViewTwo" fa-start-index="1">
    <fa-view fa-index="1">
      <fa-modifier fa-size="[320, 320]">
          <fa-surface fa-background-color="'blue'" fa-pipe-to="eventHandler"></fa-surface>
        </fa-modifier>
    </fa-view>
    <fa-view fa-index="0">
      <fa-modifier fa-size="[320, 320]">
          <fa-surface fa-background-color="'red'" fa-pipe-to="eventHandler"></fa-surface>
        </fa-modifier>
    </fa-view>
   </fa-scroll-view>    
* ```

* ```javascript
* var EventHandler = $famous['famous/core/EventHandler'];
* $scope.eventHandler = new EventHandler();
* $scope.list = [{content: "famous"}, {content: "angular"}, {content: "rocks!"}];
*
$scope.options = {
  scrollViewTwo: {
    direction: 0
  }
};
* ```

Multiple scroll views
---------------------
Combining both approaches above (a scroll view with ng-repeated views, and one with two explicitly created views), one can can nest a Scroll View within another Scroll View.
A Scroll View is a widget that displays a collection of views sequentially - it is agnostic about the views that are inside of it; it only requires that events are piped from surfaces to the Scroll View.

In the example below, the outer scroll view contains two explictly created views.  One of those views contains a scroll view with sub-views created through an ngRepeat directive.
The outer Scroll View is passed an option for its direction to be horizontal (0), and the inner Scroll View is passed an option for a vertical direction (1).

* ```html
<fa-scroll-view fa-pipe-from="eventHandler" fa-options="options.scrollViewOuter">

  <fa-view fa-index="0" id="sideBar">
    <fa-modifier fa-size="[320, 320]" id="sideBarMod">
        <fa-surface fa-background-color="'blue'" fa-pipe-to="eventHandler" fa-size="[undefined, undefined]"></fa-surface>
      </fa-modifier>
  </fa-view>

  <fa-view fa-index="1" id="main">
    <fa-scroll-view fa-pipe-from="eventHandler" fa-options="options.scrollViewInner">
      <fa-view ng-repeat="item in list">
         <fa-modifier fa-size="[300, 300]" id="{{'item' + $index + 'Mod'}}">
           <fa-surface fa-pipe-to="eventHandler" fa-size="[undefined, undefined]" fa-background-color="'red'">
             <div>{{item.content}}</div>
           </fa-surface>
         </fa-modifier>
      </fa-view> 
    </fa-scroll-view>  
  </fa-view>
   
 </fa-scroll-view>   
* ```

* ```javascript
* var EventHandler = $famous['famous/core/EventHandler'];
* $scope.eventHandler = new EventHandler();
* $scope.list = [{content: "famous"}, {content: "angular"}, {content: "rocks!"}];
*
  $scope.options = {
    scrollViewOuter: {
      direction: 0,
      paginated: true
    },
    scrollViewInner :{
      direction: 1
    }
  };
* ```

 */

angular.module('famous.angular')
  .directive('faScrollView', ['$famous', '$famousDecorator', '$timeout', function ($famous, $famousDecorator, $timeout) {
    return {
      template: '<div></div>',
      restrict: 'E',
      transclude: true,
      scope: true,
      compile: function(tElem, tAttrs, transclude){
        return  {
          pre: function(scope, element, attrs){
            var isolate = $famousDecorator.ensureIsolate(scope);

            var ScrollView = $famous["famous/views/Scrollview"];
            var ViewSequence = $famous['famous/core/ViewSequence'];
            var Surface = $famous['famous/core/Surface'];

            var _children = [];

            var options = scope.$eval(attrs.faOptions) || {};
            isolate.renderNode = new ScrollView(options);

            var updateScrollview = function(init){
              //$timeout hack used here because the
              //updateScrollview function will get called
              //before the $index values get re-bound
              //through ng-repeat.  The result is that
              //the items get sorted here, then the indexes
              //get re-bound, and thus the results are incorrectly
              //ordered.
              $timeout(function(){
                _children.sort(function(a, b){
                  return a.index - b.index;
                }); 

                var options = {
                  array: function(_children) {
	                  var _ch = [];
	                  angular.forEach(_children, function(c, i) {
		                  _ch[i] = c.renderNode;
	                  })
	                  return _ch;
                  }(_children)
                };
                //set the first page on the scrollview if
                //specified
                if(init)
                  options.index = scope.$eval(attrs.faStartIndex);
                
                var viewSeq = new ViewSequence(options);
                isolate.renderNode.sequenceFrom(viewSeq);

              })
            }

            scope.$on('registerChild', function(evt, data){
              if(evt.targetScope.$id != scope.$id){
                _children.push(data);
                updateScrollview(true);
                evt.stopPropagation();
              };
            });

            scope.$on('unregisterChild', function(evt, data){
              if(evt.targetScope.$id != scope.$id){

	            _children = function(_children) {
		          var _ch = [];
		          angular.forEach(_children, function(c) {
			        if(c.id !== data.id) {
				      _ch.push(c);
			        }
		          });
		          return _ch;
	            }(_children);
                updateScrollview();
                evt.stopPropagation();
              }
            })

          },
          post: function(scope, element, attrs){
            var isolate = $famousDecorator.ensureIsolate(scope);

            transclude(scope, function(clone) {
              element.find('div').append(clone);
            });

            scope.$emit('registerChild', isolate);

          }
        };
      }
    };
  }]);
