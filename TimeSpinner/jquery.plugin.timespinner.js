$.widget( "celcat.timespinner", { 
    // Default options.
    options: {
        time : 0,
        enabled : true,
        limitToClock : true,
        twentyFourHourClock : true,
        inputTimeOut : 3000
    },
    
    _convertTimeToText : function() {
        var hours = Math.floor(this.options.time / 60);
        var minutes = this.options.time % 60;

        if(minutes < 10)
             minutes = "0" + minutes;

        var time = hours + ":" + minutes;
        return time;
    },

    _create: function() {
        var self = this;
        var time = this.options.time;
        
        this.element.addClass("timespinner");
        
        var textField = self.element[0];
        var parentElement = textField.parentElement;
        var nextSibling = $(textField).parent().children().index(textField);
        textField.value = this._convertTimeToText();
        
        var textChanged = false;
        var intervalId = 0;
        
        function inputStarted() {
		    intervalId = setInterval(function()
		                { 
		                	var evt = document.createEvent("HTMLEvents");
						    evt.initEvent("change");
						    textField.dispatchEvent(evt); 
		                }, self.options.inputTimeOut);
		};
		
        textField.onchange = function(e)  {        	
        	var value = textField.value;
        	
        	var parts = value.split(":");
        	var hours = parseInt(parts[0]);
        	var minutes = parseInt(parts[1]);
        	
        	self.options.time = ((hours *60) + minutes);
        	textField.value = self._convertTimeToText();       	
        	
        	clearInterval(intervalId);
        };
        
        textField.on
        
        textField.onkeydown = function() {
        	if(intervalId != 0)
        		clearInterval(intervalId);
        		
        	inputStarted();
        };
        
        if(self.options.twentyFourHourClock)
        	textField.maxLength = 5;
        else
        	textField.maxLength = 9;	
        
        var buttonContainer = document.createElement("div");
        var upButton = document.createElement("BUTTON");
        var downButton = document.createElement("BUTTON");
          
        buttonContainer.className = "timespinner-buttons";   
        upButton.className = "timespinner-up-button";
        downButton.className = "timespinner-down-button";
                
        function down(e)
      	{
            var valueToSubtract = 1; //default to 1 minute
        	var selectionStart = textField.selectionStart;
        	
        	if(selectionStart < 3)
        		valueToSubtract = 60;
        		
        	self.options.time -= valueToSubtract;
        
        	if(self.options.time <= -1) {
        		if(self.options.limitToClock) {
        			self.options.time = 1439;
        		}
        		else
        		{
        			self.options.time = 0;
        		}
        	}
        	
        	textField.value = self._convertTimeToText();
        	var evt = document.createEvent("HTMLEvents");
		    evt.initEvent("change");
		    textField.dispatchEvent(evt); 
		    
		    textField.focus();
		    textField.selectionStart = selectionStart;
        	textField.selectionEnd = selectionStart; 
      	};
             
        function up(e)
      	{
        	var valueToAdd = 1; //default to 1 minute
        	var selectionStart = textField.selectionStart;
            
            if(selectionStart < 3)
        		valueToAdd = 60;
            
            self.options.time += valueToAdd;
            
        	if(self.options.time >= 1440 && self.options.limitToClock)
        		self.options.time = 0;
        	        	
        	textField.value = self._convertTimeToText();
        	
        	var evt = document.createEvent("HTMLEvents");
		    evt.initEvent("change");
		    textField.dispatchEvent(evt);  
		    textField.focus();
        	
        	textField.selectionStart = selectionStart;
        	textField.selectionEnd = selectionStart;
      	};
      	                             
        upButton.addEventListener("click",up);
		                               
        downButton.addEventListener("click",down);

        buttonContainer.appendChild(upButton);
        buttonContainer.appendChild(downButton);
        
        var container = document.createElement("div");
        container.appendChild(textField);
        container.appendChild(buttonContainer);
        parentElement.insertBefore(container, parentElement.children[nextSibling]);        
    },    

    time : function(newTime) {
    	if(newTime !== undefined) {
    		this.options.time = newTime;
    		
    		var textField = this.element[0];
    		var old = textField.value;
        	textField.value = this._convertTimeToText();
        	
        	var evt = document.createEvent("HTMLEvents");
		    evt.initEvent("change");
		    textField.dispatchEvent(evt);  
    	}
    	else
        	return this.options.time;
    }
});