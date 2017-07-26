$(document).ready(function($) {

  function hidePopupBody(){
      $(".popupBody").hide();
      document.getElementById("select_a_tag").innerHTML = "";
      $(".chosen-select-no-results").chosen_reset(config);
      $(".popupBody").css({"top":0,"left":0});
    }

    function hidePopupBody2(){
      $(".popupBody2").hide();
      $(".chosen-select-no-results2").chosen_reset(config);
      $(".popupBody2").css({"top":0,"left":0});
      document.getElementById("select_a_tag").innerHTML = "";
    }

    function hidePopupBodyAdv(){
      $(".popupBodyAdv").hide();
      document.getElementById("select_a_tag").innerHTML = "";
      $(".chosen-adv").chosen_reset(config);
      $(".popupBodyAdv").css({"top":0,"left":0});
    }

    function hidePopupBodyAdv2(){
      $(".popupBodyAdv2").hide();
      document.getElementById("select_a_tag").innerHTML = "";
      $(".chosen-adv2").chosen_reset(config);
      $(".popupBodyAdv2").css({"top":0,"left":0});
    }

    function hideNewDropdownDiv(){
      $("#newDropdownDiv").hide();
      $(".chosen-select-type").chosen_reset(config);
      $("#newDropdownDiv").css({"top":0,"left":0});
      document.getElementById("select_a_tag").innerHTML = "";
      document.getElementById("user-type-input").value = "";
      $("#user-type-input").hide();
    }


    function showSimpleOrAdvancedModeCategories(checked){
      if(checked==1){
        $("#verticalMediumClickableSpans").hide();
        $("#verticalMediumClickableSpansAdv").show();
      }else{
        $("#verticalMediumClickableSpans").show();
        $("#verticalMediumClickableSpansAdv").hide();
      }
    }

    $("#use_advanced_mode").on('change', function() {
      var checked = this.checked ? 1 : 0 ;
      $("#use_advanced_mode_").val(checked);
      Cookies.set("use_advanced_mode", checked, { expires: 365 });
      document.getElementsByName("page[use_advanced_mode]")[0].value=checked;
      showSimpleOrAdvancedModeCategories(checked);    
    });

    function parseJsonData(elementid){
      var categoryTypesDiv=document.getElementById(elementid);
      var categoriesText=categoryTypesDiv.attributes[2].textContent;
      var categoryTypesHash=JSON && JSON.parse(categoriesText) || $.parseJSON(categoriesText);
      return categoryTypesHash;
    }
    
    //Decide wich categories to show in the menu: for the simple mode or for the advanced mode
    showSimpleOrAdvancedModeCategories(Cookies.get("use_advanced_mode"));

    //Get the information about categories, their attributes and values for the simple mode
    var categoryTypesHash=parseJsonData("categoryTypesDiv");

    var catID,
        attr_name,
        categoriesInfo={};

    for (catID in categoryTypesHash){
      categoriesInfo[catID]=[];
      for (attr_name in categoryTypesHash[catID]){
        categoriesInfo[catID].push([attr_name, categoryTypesHash[catID][attr_name]['allow_user_input'], categoryTypesHash[catID][attr_name]['values']]);
      }
    }

    //Get the information about categories, their attributes, values and sequnces of these values (attributes to be filled) for the advanced mode
    var categoryTypesHashAdv=parseJsonData("categoryTypesDivAdv");

    //Get the initial attributes' ids
    var initialAttrIds=parseJsonData("initialAttrIds");

    var offset,
        focusEl,
        anchorNode,
        beginningOfSelection,
        selection,
        enableChosen,
        options,
        categoryid,
        newDropdown,
        categoryTypesTable,
        i,
        optionType,
        tagWithType,
        type,
        varTag,
        newType,
        notCollapsedArgsTable,
        nowX,
        nowY,
        docF,
        selF,
        rangeF,
        rectF,
        xF,
        yF,
        spanF,
        spanParentF,
        rangeChildNodes,
        rangeLength,
        position,
        returnOffsetvalues,
        userChosenAttributesAndValues,
        attrName,
        catHashLength,
        coords,
        seqAttrsTable,
        attrHash;

    //Parse the transcription text to transform it into XML
    var l=document.getElementById("page_source_text");
    var xml=l.textContent;
    //xml = xml.replace(/<br><\/br>/g, '<br>'); // Esli dobavliaiu eto, to oshibka parsinga
    xml = "<div id=\"bigDiv\">"+xml+"</div>";
    xml = xml.replace(/<\/br>/g, "");
    //xml = xml.replace(/&nbsp\;/g, '');

    var parser = new DOMParser();
    var doc = parser.parseFromString(xml, "text/html");
    //var doc = parser.parseFromString(xml, "text/xml");

    //var allDocContent=doc.childNodes[0];
    var allDocContent=doc.childNodes[0].childNodes[1].childNodes[0];

    var article=l;
    var firstChild=article.firstChild;
    if(firstChild==null){
      article.nodeValue=allDocContent;
    }else{
      firstChild.parentNode.replaceChild(allDocContent,firstChild);
    }

    var closingElement=article.getElementsByTagName("closing")[0];

    var container = article.parentNode;

    
    var medium = new Medium({
      element: article,
      mode: Medium.richMode,
      attributes: null,
      placeholder:"",
      tags:null,
      pasteAsText: false
    });
        

    $(".popupBody").hide();
    $(".popupBody2").hide();
    $(".popupBodyAdv").hide();
    $(".popupBodyAdv2").hide();
    $("#newDropdownDiv").hide();
    $("#deletion_div").hide();
    $("#change_div").hide();
    $("#change_selected_div").hide();    

      
    var config = {
      ".chosen-select-no-results": {width:"100%"},
      ".chosen-select-no-results2": {width:"100%"},
      ".chosen-adv": {width:"100%"},
      ".chosen-adv2": {width:"100%"}
    }

    var selector;
    for (selector in config) {
      $(selector).chosen(config[selector]);
    }
    

    $(".chosen-select-no-results").chosen();
    $(".chosen-select-no-results2").chosen();
    $(".chosen-adv").chosen();
    $(".chosen-adv2").chosen();
      
    jQuery.fn.chosen_reset = function(n){
      $(this).chosen('destroy');
      $(this).prop('selectedIndex', 0);
      $(this).chosen(n)
    }
    
    //var hotkeysHash={'insert_tag':'alt+c', 'get_out_of_tag':'alt+x','modify_tag':'alt+m','delete_tag':'alt+n','hide_popup':'alt+r'};
    //If the user has defined his own hot keys, we take their values from the localstorage object
    var hotkeysHash={};
    hotkeysHash["insert_tag"] = localStorage["insert_tag"] || "Alt+C";
    hotkeysHash["get_out_of_tag"] = localStorage["get_out_of_tag"] || "Alt+X";
    hotkeysHash["modify_tag"] = localStorage["modify_tag"] || "Alt+M";
    hotkeysHash["delete_tag"] = localStorage["delete_tag"] || "Alt+N";
    hotkeysHash["hide_popup"] = localStorage["hide_popup"] || "Alt+R";


    //Update hot keys indicated in buttons titles
    function updateHotkeysInButtonTitles(){
      document.getElementsByClassName("change_tag")[0].title+=localStorage["modify_tag"] || "Alt+M";
      document.getElementsByClassName("change_tag")[1].title+=localStorage["modify_tag"] || "Alt+M";
      document.getElementsByClassName("delete_tag")[0].title+=localStorage["delete_tag"] || "Alt+N";
      document.getElementsByClassName("delete_tag")[1].title+=localStorage["delete_tag"] || "Alt+N";
      document.getElementsByClassName("hide_popup_new")[0].title+=localStorage["hide_popup"] || "Alt+R";
      document.getElementsByClassName("hide_popup_small")[0].title+=localStorage["hide_popup"] || "Alt+R";
      document.getElementsByClassName("hide_popup_small")[1].title+=localStorage["hide_popup"] || "Alt+R";
      document.getElementsByClassName("hide_popup_small")[2].title+=localStorage["hide_popup"] || "Alt+R";
      document.getElementsByClassName("hide_popup_small")[3].title+=localStorage["hide_popup"] || "Alt+R";
    }

    updateHotkeysInButtonTitles();

    //When the user pushes the button with a key on it, this function fires and shows a popup menu that lets him change hot keys
    function showChangeHotkeysMenu(){

      var listOfHelpKeys=["","Alt","Ctrl","Shift","Insert","PGUP","PGDN","FN","Tab"];

      var changeHotKeysInternal=document.getElementById("changeHotKeysInternal");

      jQuery.each(hotkeysHash, function (name, value) {
        var keyPlusKey=value.split('+');
        
        var firstKey=keyPlusKey[0];
        var middleKey="";
        if(keyPlusKey.length==3){
          middleKey=keyPlusKey[1];
        }

        var lastKey=keyPlusKey[keyPlusKey.length-1];

        var select = document.createElement("select");
        select.id = name;
        select.name=name;
        select.className="hotkeyDropdownMenu";

        var select2 = document.createElement("select");
        select2.id = name+'2';
        select2.name=name+'2';
        select2.className="hotkeyDropdownMenu";

        var h,
            option,
            option2;

        for(h=0; h<listOfHelpKeys.length; h++){          

          option = document.createElement("option");
          option.value=listOfHelpKeys[h];
          
          if(listOfHelpKeys[h]==firstKey){
            option.selected="checked";
          }else{
            option.selected="";
          }

          option.innerHTML= listOfHelpKeys[h];
          select.appendChild(option);

          option2 = document.createElement("option");
          option2.value=listOfHelpKeys[h];
          
          if(listOfHelpKeys[h]==middleKey){
            option2.selected="checked";
          }else{
            option2.selected="";
          }        
          option2.innerHTML= listOfHelpKeys[h];
          select2.appendChild(option2);
        }

        if(middleKey==''){
          select2.selectedIndex = -1;
        }        

        $('#changeHotKeysInternal').append('<label class="hotkey_label">' + name.replace(/_/g, ' ') + ':</label>');
        $('#changeHotKeysInternal').append(select);
        $('#changeHotKeysInternal').append(select2);
        $('#changeHotKeysInternal').append('<input type="text" id="input_'+name+'" class="hotkeyDropdownMenu" maxlength="1" value="'+lastKey+'"></input><br/>');
        
      });

      $("#changeHotkeysMenu").show();
    }

    //Hides the change hot keys pop up menu
    function hideChangeKeysPopup(){
      $("#changeHotKeysInternal").empty();
      $("#changeHotkeysMenu").hide();
    }

    //Applies the changes to hot keys made by the user
    function changeHotKeys(){
      if (typeof(Storage) !== "undefined") {
        // Code for localStorage
        var firstKey,
            middleKey,
            lastKey,
            newvalue,
            keyPlusKey,
            name,
            i,
            select1,
            valselect1=null,
            select2,
            valselect2=null,
            keys = Object.keys(hotkeysHash),
            len = keys.length;


        for(i=0; i<len; i++) {
          name=keys[i];
          keyPlusKey=hotkeysHash[name].split('+');
        
          firstKey=keyPlusKey[0];
          middleKey='';
          if(keyPlusKey.length==3){
            middleKey=keyPlusKey[1];
          }

          select1 = document.getElementById(name);
          if(select1.selectedIndex==-1){
            valselect1='';
          }else{
            valselect1 = select1.options[select1.selectedIndex].value || '';
          }

          select2=document.getElementById(name+'2');
          if(select2.selectedIndex==-1){
            valselect2='';
          }else{
            valselect2 = select2.options[select2.selectedIndex].value || '';
          }

          if(valselect1!=null){
            firstKey=valselect1;
          }
          if(valselect2!=null){
            middleKey=valselect2;
          }
          if(document.getElementById('input_'+name).value!=null){
            lastKey=document.getElementById('input_'+name).value;
          }
          
          if(middleKey!=''){
            newValue=firstKey+'+'+middleKey+'+'+lastKey;
          }else{
            newValue=firstKey+'+'+lastKey;
          }

          //If the values of all the 3 fields corresponding to new hot keys are empty, we give an error message 
          if(newValue=='+'){
            alert("The \""+name.replace(/_/g, ' ')+"\" hot key is empty. Please, choose a value.");
            break;
          }else{
            localStorage.setItem(name,newValue);
            hotkeysHash[name]=newValue;
          }

          if(i==(len-1)){
            //Hide the popup menu
            hideChangeKeysPopup();
            alert("The hot keys have been changed. Please, reload the page in your browser.");
            updateHotkeysInButtonTitles();
          }
        }

      } else {
        // Sorry! No Web Storage support..
        alert("Sorry, hot keys can't be changed. Your browser doesn't support HTML Storage.");
        //Hide the popup menu
        hideChangeKeysPopup();
      }
    }


    //Go out of the current tag
    jQuery('#page_source_text').bind('keypress', hotkeysHash['get_out_of_tag'], function(e) {
      returnOffsetvalues=medium.returnOffset();
      offset=returnOffsetvalues[0];
      focusEl=returnOffsetvalues[1];

      if(focusEl.parentNode.id!="page_source_text" && focusEl.parentNode.id!="bigDiv" && focusEl.id!="page_source_text" && focusEl.id!="bigDiv"){
        medium.focus();
        medium.focusNadya(offset,focusEl);
        medium.cursorAfterTag(focusEl);

      }

      return false;

    });

    jQuery('#page_source_text').bind('keypress', 'alt+h', function(e) {
      var m = medium.value();
      console.log(m);

      if(m.match(/\u200B/)!=null){
        console.log("found invisible caracters");
      }
      
      return false;

    });



    //If the user types text in the input field of the category type select box in order to select one of the options
    jQuery.fn.filterByTextS = function(textbox, medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton) {
      var option;
      var select;
      var options;
      var options2;
      var search;
      var regex;
      var arrowPosition=0;

      return this.each(function() {
        select = this;
        var length=$(select).attr("size");
        options = [];
        $(select).find('option').each(function() {
          options.push({value: $(this).val(), text: $(this).text()});
        });
        $(select).data('options', options);

        $(textbox).off().on('change keyup', function(e) {

          if (e.which == 40) {
            if(arrowPosition>=0 && arrowPosition<options.length){
              $(textbox).val(options[arrowPosition]['text']);
              if(arrowPosition!=(options.length-1)){
                arrowPosition+=1;
              }
            }
          }else if(e.which == 38){
            if(arrowPosition>=0 && arrowPosition<options.length){
              $(textbox).val(options[arrowPosition]['text']);
              if(arrowPosition!=0){
                arrowPosition=arrowPosition-1;
              }
            }
          }else{

            options2 = $(select).empty().data('options');
            $(select).attr("size", 0);
            search = $.trim($(this).val());

            if(search!=null && search!=""){
              regex = new RegExp("^"+search,"gi");

              $.each(options2, function(i) {
                if(options2!=null){
                option = options2[i];
                if(option.value!="" && option.value.match(regex) !== null) {
                  $(select).append(
                    $('<option>').text(option.text).val(option.value)
                  );
                  $(select).attr("size", $(select).attr("size")+1);
                  //If the user presses enter
                  if (e.which == 13) {
                    if(notCollapsedArgsTable==null){
                      $("#newDropdownDiv").hide();
                      document.getElementById("select_a_tag").innerHTML = "";
                      userChosenAttributesAndValues.push([attrName,option.value]);

                      options2=null;

                      if (num<(categoryTable.length-1)){
                        getNextSomethingSelected(varTag, num+1, categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
                      }

                      if (num==(categoryTable.length-1)){
                        medium.tagSelection3(varTag, userChosenAttributesAndValues, notCollapsedArgsTable[0], focusNode, notCollapsedArgsTable[1], focusOffset);
                      }
                    }else{
                      $("#newDropdownDiv").hide();
                      $("#select-type-input").hide();
                      $("#select-type-input")[0].value="";
                      $('#chosen-select-type').empty();
                      $('#chosen-select-type')[0].value="";

                      document.getElementById('select_a_tag').innerHTML = "";

                      userChosenAttributesAndValues.push([attrName,option.value]);

                      if (num<(categoryTable.length-1)){
                        getNextSomethingSelected(varTag, num+1, categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
                      }

                      if (num==(categoryTable.length-1)){
                        medium.tagSelection3(varTag, userChosenAttributesAndValues, notCollapsedArgsTable[0], focusNode, notCollapsedArgsTable[1], focusOffset);
                      }
                    }
                  }
                }
                }
              });
            }else{ // if search==null || search==""
              $(select).attr("size", length);
              $.each(options2, function(i) {
                option = options2[i];
                if(option.value!="") {
                  $(select).append(
                    $('<option>').text(option.text).val(option.value)
                  );
                }
              });
            }
          }
        });
      });
    };

    //If the user types text in the input field of the category type select box in order to select one of the options
    jQuery.fn.filterByTextCollapsed = function(textbox, medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton) {
      var option;
      var select;
      var options;
      var options2;
      var search;
      var regex;
      var arrowPosition=0;
      
      return this.each(function() {
        select = this;
        var length=$(select).attr("size");
        options = [];
        $(select).find('option').each(function() {
          options.push({value: $(this).val(), text: $(this).text()});
        });
        $(select).data('options', options);

        $(textbox).off().on('change keyup', function(e) {

        if (e.which == 40) {
          if(arrowPosition>=0 && arrowPosition<options.length){
            $(textbox).val(options[arrowPosition]['text']);
            if(arrowPosition!=(options.length-1)){
              arrowPosition+=1;
            }
          }
        }else if(e.which == 38){
          if(arrowPosition>=0 && arrowPosition<options.length){
            $(textbox).val(options[arrowPosition]['text']);
            if(arrowPosition!=0){
              arrowPosition=arrowPosition-1;
            }
          }
        }else{
          options2 = $(select).empty().data('options');
          $(select).attr("size", 0);
          search = $.trim($(this).val());
          if(search!=null && search!=""){
            regex = new RegExp("^"+search,"gi");

            $.each(options2, function(i) {
              if(options2!=null){
              option = options2[i];
              if(option.value!="" && option.value.match(regex) !== null) {
                $(select).append(
                  $('<option>').text(option.text).val(option.value)
                );
                $(select).attr("size", $(select).attr("size")+1);
                //If the user presses enter
                if (e.which == 13) {
                  
                    $("#newDropdownDiv").hide();

                    $("#select-type-input").hide();
                    $("#select-type-input")[0].value="";
                    $('#chosen-select-type').empty();
                    $('#chosen-select-type')[0].value="";

                    document.getElementById('select_a_tag').innerHTML = "";
                    userChosenAttributesAndValues.push([attrName,option.value]);
                    options2=null;
                    if (num<(categoryTable.length-1)){
                      getNextCollapsed(varTag,num+1, categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
                    }

                    if (num==(categoryTable.length-1)){
                      document.getElementById('select_a_tag').innerHTML = "";
                      addCategoryWithTypeS (medium, varTag, userChosenAttributesAndValues, focusOffset,focusNode);

                    }

                }
              }
              }
            });

          }else{ // if search==null || search==""
            $(select).attr("size", length);
            $.each(options2, function(i) {
              option = options2[i];
              if(option.value!="") {
                $(select).append(
                  $('<option>').text(option.text).val(option.value)
                );

              }
            });
          }
          }
        });
      });
    };


    function addCategoryWithTypeS (medium, varTag, userChosenAttributesAndValues, focusOffset,focusNode){
      var couple;
      var attrString="";

        medium.focus();

        d = new Date();
        milliseconds = d.getTime();
        tagCode=milliseconds.toString();

        for (couple in userChosenAttributesAndValues){
          attrString+=" "+userChosenAttributesAndValues[couple][0]+"=\""+userChosenAttributesAndValues[couple][1]+"\"";
        }

        tagWithType='<'+varTag+' tagcode="'+tagCode+'" class="medium-'+varTag+'" '+attrString+'>\u200B</'+varTag+'>';


        medium.focusNadya(focusOffset,focusNode);
        medium.insertHtmlNadya(tagWithType, focusOffset, focusNode);
        tagWithType='';

        $('#chosen-select-type').empty();
        $('#chosen-select-type')[0].value="";

        return false;
    }


    function tagSelectionWithType (categoryid, categoriesInfo, medium, varTag, focusOffset,focusNode, notCollapsedArgsTable, coords,onButton){

      var categoryTable=categoriesInfo[categoryid];
                
      getNextSomethingSelected(varTag, 0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
      
    }


    function getNextSomethingSelected(varTag, num, categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton){
            
        var categoryTypesTable=categoryTable[num][2];
        var attrName=categoryTable[num][0];
        var allow_user_input=categoryTable[num][1];

        
        //If there are predefined values for this attribute
      if(categoryTypesTable.length>0){
        //Create the new dropdown menu for category types
        newDropdown=addNewDropdown(categoryTypesTable.length,attrName, "Select");

        for(i=0; i< categoryTypesTable.length; i++){
          //Add an option for the category types dropdown menu
          addAnOption(newDropdown,categoryTypesTable[i]);
                    
          if(i==(categoryTypesTable.length-1)){
            if(onButton==true){
              $("#newDropdownDiv").css({'top':coords.y,'left':'','right':'4vw', 'position':'absolute'});
            }else{
              $("#newDropdownDiv").css({'top':coords.y,'left':coords.x, 'right':'','position':'absolute'});
            }
            
            $("#newDropdownDiv").show();
            $('#select-type-input').show();
            $("#select-type-input")[0].value="";
            $('#select-type-input').focus();

            if(allow_user_input==1){ //If the user can enter a new value for this attribute          
              $('#user-type-input').show();
              jQuery.fn.userInputAttrValueSomethingSelected ($('#user-type-input'), medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
            }

            $('#chosen-select-type').filterByTextS($('#select-type-input'), medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
                      
            $("#chosen-select-type").off().change(attrName,function(event3){                        
                                                
              if(event3.target == this){
                type=$(this).val();
                if(type!=null && type!=''){
                  newType=type;
                  type='';

                  userChosenAttributesAndValues.push([attrName,newType]);
                            
                  $("#newDropdownDiv").hide();
                  $('#chosen-select-type').empty();
                  $('#chosen-select-type')[0].value="";
                  document.getElementById('select_a_tag').innerHTML = "";
                            
                  if (num<(categoryTable.length-1)){
                    getNextSomethingSelected(varTag, num+1, categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
                  }

                  if (num==(categoryTable.length-1)){
                    medium.tagSelection3(varTag, userChosenAttributesAndValues, notCollapsedArgsTable[0], focusNode, notCollapsedArgsTable[1], focusOffset);
                  }
                            
                }
              }
                      
            });
          }
        }
      }else{//If there are no predefined values for this attribute
        if(allow_user_input==1){ //If the user can enter a new value for this attribute
          //Create the new dropdown menu for category types
          newDropdown=addNewDropdown(categoryTypesTable.length,attrName, "Input");

          if(onButton==true){
            $("#newDropdownDiv").css({'top':coords.y,'left':'','right':'4vw', 'position':'absolute'});
          }else{
            $("#newDropdownDiv").css({'top':coords.y,'left':coords.x,'right':'', 'position':'absolute'});
          }
          
          $("#newDropdownDiv").show();
          $("#select-type-input").hide();
          //$("#select-type-input").empty();
          $("#select-type-input")[0].value="";
          $('#chosen-select-type').empty();
          $('#chosen-select-type')[0].value="";
          $("#chosen-select-type").hide();          
          $('#user-type-input').show();
          $('#user-type-input').focus();
          jQuery.fn.userInputAttrValueSomethingSelected ($('#user-type-input'), medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
        }else{ //The user can't enter a new value (erroneous case: the attribute exists, but has no values and can't obtain one)

          alert("There is a mistake in the attribute \""+attrName+"\" design: an attribute should either have a list of predefined values or allow user input.");
          return false;
          
        }

      }     
    }

    //Create the new dropdown menu for category types
    function addNewDropdown (length, attr_name, selectOrType){
      newDropdown=document.getElementById('chosen-select-type');
      newDropdown.setAttribute("size", length);
      
      var title=document.getElementById('select_a_tag');
      var content = document.createTextNode(selectOrType+" "+attr_name);
      title.appendChild(content);
      return newDropdown;
    }

    //Add an option to the dropdown menu of category types
    function addAnOption(newDropdown,typedata){
      optionType=document.createElement("option");
      optionType.text=typedata;
      optionType.value=typedata;
      newDropdown.add(optionType,newDropdown.options[null]);
    }


    function hidePopups(){
      $("#deletion_div").hide();
      $("#deletion_div").empty();
      $("#change_div").hide();
      $("#change_div").empty();
      $("#change_selected_div").hide();
      $("#change_selected_div").empty();


      hidePopupBody();

      hidePopupBody2();

      hidePopupBodyAdv();

      hidePopupBodyAdv2();

      hideNewDropdownDiv();

      hideChangeKeysPopup();

      hideDeletionPopup();
      hideChangePopup();

      medium.focus();
      medium.focusNadya(focusOffset,focusNode);
    }


    //Press alt+r to make a dropdown select disappear without selecting anything
    jQuery(document).bind('keypress', hotkeysHash['hide_popup'], function(e) {
      hidePopups();
    });

    //Press alt+r to make a dropdown select disappear without selecting anything
    jQuery('#page_source_text').bind('keypress', hotkeysHash['hide_popup'], function(e) {
      hidePopups();
    });

    //Press alt+r to make a dropdown select disappear without selecting anything
    jQuery('.popupBody').bind('keypress', hotkeysHash['hide_popup'], function(e) {
      hidePopups();
    });

    //Press alt+r to make a dropdown select disappear without selecting anything
    jQuery('.popupBody2').bind('keypress', hotkeysHash['hide_popup'], function(e) {
      hidePopups();
    });
    
    //Press alt+r to make a dropdown select disappear without selecting anything
    jQuery('.popupBodyAdv').bind('keypress', hotkeysHash['hide_popup'], function(e) {
      hidePopups();
    });

    //Press alt+r to make a dropdown select disappear without selecting anything
    jQuery('.popupBodyAdv2').bind('keypress', hotkeysHash['hide_popup'], function(e) {
      hidePopups();
    });

    //Press alt+r to make a dropdown select disappear without selecting anything
    jQuery('#newDropdownDiv').bind('keypress', hotkeysHash['hide_popup'], function(e) {
      hidePopups();
    });

    //Press alt+r to make a dropdown select disappear without selecting anything
    jQuery('#deletion_div').bind('keypress', hotkeysHash['hide_popup'], function(e) {
      hidePopups();
    });

    //Press alt+r to make a dropdown select disappear without selecting anything
    jQuery('#change_div').bind('keypress', hotkeysHash['hide_popup'], function(e) {
      hidePopups();
    });

    //Press alt+r to make a dropdown select disappear without selecting anything
    jQuery('#change_selected_div').bind('keypress', hotkeysHash['hide_popup'], function(e) {
      hidePopups();
    });
    
    //Press alt+r to make a dropdown select disappear without selecting anything
    jQuery('#changeHotkeysMenu').bind('keypress', hotkeysHash['hide_popup'], function(e) {
      hidePopups();
    });

    //Press alt+r to make a dropdown select disappear without selecting anything
    jQuery('#changeHotKeysInternal').bind('keypress', hotkeysHash['hide_popup'], function(e) {
      hidePopups();
    });

    //Press alt+r to make a dropdown select disappear without selecting anything
    jQuery('#changeHotKeysInternal').children().bind('keypress', hotkeysHash['hide_popup'], function(e) {
      hidePopups();
    });

    //Press alt+r to make a dropdown select disappear without selecting anything
    jQuery('.hotkeyDropdownMenu').bind('keypress', hotkeysHash['hide_popup'], function(e) {
      hidePopups();
    });

    //Press alt+r to make a dropdown select disappear without selecting anything
    jQuery('.hotkeyDropdownMenu').children().bind('keypress', hotkeysHash['hide_popup'], function(e) {
      hidePopups();
    });

    //Press alt+r to make a dropdown select disappear without selecting anything
    jQuery('#select-type-input').bind('keypress', hotkeysHash['hide_popup'], function(e) {
      hidePopups();
    });

    //Press alt+r to make a dropdown select disappear without selecting anything
    jQuery('#select-type-input').children().bind('keypress', hotkeysHash['hide_popup'], function(e) {
      hidePopups();
    });

    //Press alt+r to make a dropdown select disappear without selecting anything
    jQuery('.chosen-search').children().bind('keypress', hotkeysHash['hide_popup'], function(e) {
      hidePopups();
    });

    function getSelectionCoords(win) {
      win = win || window;
      docF = win.document;
      selF = docF.selection;
      rangeF=null;
      rectsF=null;
      rectF=null;
      spanF=null;
      spanParentF=null;

      xF = 0;
      yF = 0;

      if (selF) {
        if (selF.type != "Control") {
            rangeF = selF.createRange();
            rangeF.collapse(true);
            xF = rangeF.boundingLeft;
            yF = rangeF.boundingTop;
        }
      } else if (win.getSelection) {
        selF = win.getSelection();
        if (selF.rangeCount) {
            rangeF = selF.getRangeAt(0).cloneRange();
            if (rangeF.getClientRects.length>0) {
                rangeF.collapse(true);
                rectsF = rangeF.getClientRects();
                if (rectsF.length > 0) {
                    rectF = rects[0];
                }
                xF = rectF.left;
                yF = rectF.top;
            }else{
              // Fall back to inserting a temporary element
              if (xF == 0 && yF == 0) {
                spanF = docF.createElement("span");
                if (spanF.getClientRects) {
                    // Ensure span has dimensions and position by
                    // adding a zero-width space character
                    spanF.appendChild( docF.createTextNode("\u200b") );
                    rangeF.insertNode(spanF); // inserts a node at the end of the range

                    rangeChildNodes=rangeF.endContainer.childNodes;
                    for (ch=0; ch<rangeChildNodes.length; ch++) {
                      var he=rangeChildNodes[ch];
                      if (he.tagName=="SPAN"){
                        spanF=he;
                        break;
                      }
                    }
                    //rangeLength=rangeChildNodes.length;
                    //spanF=rangeF.endContainer.childNodes[rangeChildNodes.length-2];
                    //rectF = getCoords2(spanF);
                    rectF = spanF.getClientRects()[0];
                    xF = rectF.left;
                    yF = rectF.top;
                    spanParentF = spanF.parentNode;
                    
                    spanParentF.removeChild(spanF);

                    // Glue any broken text nodes back together
                    spanParentF.normalize();
                }
              }
            }
        }
      }

      var pageScrolleFromTop=$(window).scrollTop();
      var pageScrolleFromLeft=$(window).scrollLeft();

      return { x: xF+pageScrolleFromLeft, y: yF+pageScrolleFromTop };
    }


    jQuery.fn.filterByTextAdvanced= function(level,textbox, medium, varTag,initialAttrIds, userChosenAttributesAndValues, attrName,attrHash, num,numSeqAttr, seqAttrsTable,categorySeqHash, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected){
      var option;
      var select;
      var options;
      var options2;
      var search;
      var regex;
      var arrowPosition=0;

      
      return this.each(function() {
        select = this;
        var length=$(select).attr("size");
        options = [];
        $(select).find('option').each(function() {
          options.push({value: $(this).val(), text: $(this).text()});
        });
        $(select).data('options', options);

        $(textbox).off().on('change keyup', function(e) {

        if (e.which == 40) {
          if(arrowPosition>=0 && arrowPosition<options.length){
            $(textbox).val(options[arrowPosition]['text']);
            if(arrowPosition!=(options.length-1)){
              arrowPosition+=1;
            }
          }
        }else if(e.which == 38){
          if(arrowPosition>=0 && arrowPosition<options.length){
            $(textbox).val(options[arrowPosition]['text']);
            if(arrowPosition!=0){
              arrowPosition=arrowPosition-1;
            }
          }
        }else{
          options2 = $(select).empty().data('options');
          $(select).attr("size", 0);
          search = $.trim($(this).val());
          if(search!=null && search!=""){
            regex = new RegExp("^"+search,"gi");

            $.each(options2, function(i) {
              if(options2!=null){
              option = options2[i];
              if(option.value!="" && option.value.match(regex) !== null) {
                $(select).append(
                  $('<option>').text(option.text).val(option.value)
                );
                $(select).attr("size", $(select).attr("size")+1);
                //If the user presses enter
                if (e.which == 13) {
                    var newType=option.value;
                    $("#newDropdownDiv").hide();
                    $("#select-type-input").show();
                    $('#chosen-select-type').empty();
                    $('#chosen-select-type')[0].value="";
                    $("#chosen-select-type").show();                    
                    $('#user-type-input').hide();

                    $("#select-type-input")[0].value="";

                    options2=null;

                    document.getElementById('select_a_tag').innerHTML = "";
                    
                    userChosenAttributesAndValues.push([attrName,option.value]);

                    //If the chosen value has consequent attributes
                    if(attrHash[newType].length>0){

                      seqAttrsTable=attrHash[newType];
                      numSeqAttr=0;

                      tagSeqs(level+1,varTag,initialAttrIds, num, numSeqAttr, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                      return;
                    }else{ //If the chosen value doesn't have consequent attributes
 
                      if (numSeqAttr<(seqAttrsTable.length-1)){
                        tagSeqs(level,varTag,initialAttrIds, num, numSeqAttr+1, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                        return;
                      }else if (numSeqAttr==(seqAttrsTable.length-1) && numSeqAttr==0){
                        seqAttrsTable=seqAttrsPerLevel[level-1];
                        tagSeqs(level-1,varTag,initialAttrIds, num, -1, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                        return;
                      }else if (numSeqAttr==(seqAttrsTable.length-1) && numSeqAttr!=0){
                        if(level==1 || level==0){
                          tagSeqsInitial(varTag,num+1, initialAttrIds, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                          return;
                        }else{
                          seqAttrsTable=seqAttrsPerLevel[level-1];
                          tagSeqs(level-1,varTag,initialAttrIds, num, -1, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                          return;
                        }
                      }
                    }
                }
              }
              }
            });

          }else{ // if search==null || search==""
            $(select).attr("size", length);
            $.each(options2, function(i) {
              option = options2[i];
              if(option.value!="") {
                $(select).append(
                  $('<option>').text(option.text).val(option.value)
                );

              }
            });
          }
          }
        });
      });
    }


      //The user types the value of a category attribute
    jQuery.fn.userInputAttrValueAdvanced = function(level,textbox, medium, varTag,initialAttrIds, userChosenAttributesAndValues, attrName, num,numSeqAttr, seqAttrsTable,categorySeqHash, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected) {
      var option;
      var select;
      var options;
      var options2;
      var search;
      var regex;

      $(textbox).off().on('change keyup', function(e) {
        //If the user presses enter
        if (e.which == 13) {
            
          $("#newDropdownDiv").hide();
          $("#select-type-input").show();
          $("#select-type-input")[0].value="";
          $("#chosen-select-type").show();
          $('#chosen-select-type').empty();
          $('#chosen-select-type')[0].value="";
          $('#user-type-input').hide();
          document.getElementById('select_a_tag').innerHTML = "";

          userChosenAttributesAndValues.push([attrName,cleanAttrValue($(textbox).val())]);
          $(textbox).val('');
          if (numSeqAttr<(seqAttrsTable.length-1)){
            tagSeqs(level,varTag,initialAttrIds, num, numSeqAttr+1, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
            return;
          }else if (numSeqAttr==(seqAttrsTable.length-1) && numSeqAttr==0){
            seqAttrsTable=seqAttrsPerLevel[level-1];
            tagSeqs(level-1,varTag,initialAttrIds, num, -1, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
            return;
          }else if (numSeqAttr==(seqAttrsTable.length-1) && numSeqAttr!=0){
            if(level==1 || level==0){
              tagSeqsInitial(varTag,num+1, initialAttrIds, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
              return;
            }else{
              seqAttrsTable=seqAttrsPerLevel[level-1];
              tagSeqs(level-1,varTag,initialAttrIds, num, -1, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
              return;
            }
          }
        }
      });
    }

    //The user types the value of a category attribute
    jQuery.fn.userInputAttrValueAdvancedInitial = function(level,textbox, medium, varTag,initialAttrIds,categorySeqHash, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected) {
      var option;
      var select;
      var options;
      var options2;
      var search;
      var regex;

        $(textbox).off().on('change keyup', function(e) {
          //If the user presses enter
          if (e.which == 13) {
            
              $("#newDropdownDiv").hide();
              $("#select-type-input").show();
              $("#select-type-input")[0].value="";
              $("#chosen-select-type").show();
              $('#chosen-select-type').empty();
              $('#chosen-select-type')[0].value="";
              $('#user-type-input').hide();
              document.getElementById('select_a_tag').innerHTML = "";

              userChosenAttributesAndValues.push([attrName,cleanAttrValue($(textbox).val())]);
              $(textbox).val('');
              
              if (num<(initialAttrIds.length-1)){
                tagSeqsInitial(varTag,num+1, initialAttrIds, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                return;
              }else if (num==(initialAttrIds.length-1)){
                //addCategoryWithTypeS (medium, varTag, userChosenAttributesAndValues, focusOffset,focusNode);
                tagSeqsInitial(varTag,num+1, initialAttrIds, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                return;
              }
            
          }
      });
      
    }

    var seqAttrsPerLevel={};
    var numsSeqAttrPerLevel={};

    function tagSeqs(level,varTag,initialAttrIds, num, numSeqAttr, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected){

      if(level<=0){
        tagSeqsInitial(varTag,num+1, initialAttrIds, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
        return;
      }else{

      //When going up we register the information for this level. This information will be used when going down
      if(numSeqAttr!=-1){
        numsSeqAttrPerLevel[level]=numSeqAttr;
        seqAttrsPerLevel[level]=seqAttrsTable;
      }
      
      var attrId;
      if (numSeqAttr>-1){ //When going up
        attrId=seqAttrsTable[numSeqAttr][0];
      }else if(numSeqAttr==-1){ //When going down
        //We take the registered number and take the following one
        numSeqAttr=numsSeqAttrPerLevel[level]+1;
        //And we register the number of the attribute we are going to use. It will be the last attribute used on this level
        numsSeqAttrPerLevel[level]=numSeqAttr;

        seqAttrsTable=seqAttrsPerLevel[level];

        //If the last attribute of this level was defined, we go down
        if(numSeqAttr>=seqAttrsTable.length){
          seqAttrsTable=seqAttrsPerLevel[level-1];
          tagSeqs(level-1,varTag,initialAttrIds, num, -1, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
          return;
        }else{
          attrId=seqAttrsTable[numSeqAttr][0];
        }        
      }

      var categoryTypesHa=categorySeqHash[attrId];
      var attrName=categoryTypesHa['name'];
      var allow_user_input=categoryTypesHa['allow_user_input'];
      attrHash=categoryTypesHa['values'];
      var categoryTypesTable=Object.keys(attrHash);
      
      var i;

      //If an attribute has no predefined values and no user input possibility, give an error message
      if(categoryTypesTable.length==0 && allow_user_input==0){
        alert("There is an error in the attribute's "+attrName+" conception. It should either have predefined values or allow user input.");
      }else{
        //If there are predefined values for this attribute
        if(categoryTypesTable.length>0){
          //Create the new dropdown menu for category types
          newDropdown=addNewDropdown(categoryTypesTable.length,attrName, "Select");

          for(i=0; i< categoryTypesTable.length; i++){
            //Add an option for the category types dropdown menu
            addAnOption(newDropdown,categoryTypesTable[i]);
                    
            if(i==(categoryTypesTable.length-1)){
              if(onButton){
                $("#newDropdownDiv").css({'top':coords.y,'left':'','right':'4vw', 'position':'absolute'});
              }else{
                $("#newDropdownDiv").css({'top':coords.y,'left':coords.x,'right':'', 'position':'absolute'});
              }
            
              $("#newDropdownDiv").show();
              $('#select-type-input').show();
              $("#select-type-input")[0].value="";
              $('#select-type-input').focus();
              $('#chosen-select-type')[0].value="";
              $("#chosen-select-type").show();

              if(allow_user_input==1){ //If the user can enter a new value for this attribute          
                $('#user-type-input').show();
                jQuery.fn.userInputAttrValueAdvanced (level,$('#user-type-input'), medium, varTag,initialAttrIds, userChosenAttributesAndValues, attrName, num,numSeqAttr, seqAttrsTable,categorySeqHash, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                return;
              }

              $('#chosen-select-type').filterByTextAdvanced(level,$('#select-type-input'), medium, varTag,initialAttrIds, userChosenAttributesAndValues, attrName,attrHash, num,numSeqAttr, seqAttrsTable,categorySeqHash, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                      
              $("#chosen-select-type").off().change(attrName,function(event3){                       
                document.getElementById('select_a_tag').innerHTML = "";                      
                if(event3.target == this){
                  type=$(this).val();
                  if(type!=null && type!=''){
                    newType=type;
                    type='';

                    userChosenAttributesAndValues.push([attrName,newType]);
                            
                    $("#newDropdownDiv").hide();
                    $('#chosen-select-type').empty();
                    $('#chosen-select-type')[0].value="";

                    //If the chosen value has consequent attributes
                    if(attrHash[newType].length>0){
                      seqAttrsTable=attrHash[newType];
                      numSeqAttr=0;

                      tagSeqs(level+1,varTag,initialAttrIds, num, numSeqAttr, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                      return;

                    }else{ //If the chosen value doesn't have consequent attributes
 
                      if (numSeqAttr<(seqAttrsTable.length-1)){
                        tagSeqs(level,varTag,initialAttrIds, num, numSeqAttr+1, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                        return;
                      }else if (numSeqAttr==(seqAttrsTable.length-1) && numSeqAttr==0){
                        seqAttrsTable=seqAttrsPerLevel[level-1];
                        tagSeqs(level-1,varTag,initialAttrIds, num, -1, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                        return;
                      }else if (numSeqAttr==(seqAttrsTable.length-1)){
                        if(level==1 || level==0){
                          tagSeqsInitial(varTag,num+1, initialAttrIds, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                          return;
                        }else{
                          seqAttrsTable=seqAttrsPerLevel[level-1];
                          tagSeqs(level-1,varTag,initialAttrIds, num, -1, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                          return;
                        }
                      }
                    }         
                  }
                }     
              });
            }
          }
        }else{ //If there are no predefined values for this attribute
          if(allow_user_input==1){ //If the user can enter a new value for this attribute
            //Create the new dropdown menu for category types
            newDropdown=addNewDropdown(categoryTypesTable.length,attrName, "Input");
            if(onButton){
              $("#newDropdownDiv").css({'top':coords.y,'left':'','right':'4vw', 'position':'absolute'});
            }else{
              $("#newDropdownDiv").css({'top':coords.y,'left':coords.x,'right':'', 'position':'absolute'});
            }
          
            $("#newDropdownDiv").show();
            $("#select-type-input").hide();
            $("#select-type-input")[0].value="";
            $('#chosen-select-type').empty();
            $('#chosen-select-type')[0].value="";
            $("#chosen-select-type").hide();          
            $('#user-type-input').show();
            $('#user-type-input').focus();
            jQuery.fn.userInputAttrValueAdvanced (level,$('#user-type-input'), medium, varTag,initialAttrIds, userChosenAttributesAndValues, attrName, num,numSeqAttr, seqAttrsTable,categorySeqHash, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
            return;
          }else{ //The user can't enter a new value (erroneous case: the attribute exists, but has no values and can't obtain one)

            alert("There is a mistake in the attribute \""+attrName+"\" design: an attribute should either have a list of predefined values or allow user input.");
            return false;
          
          }
        }
        //return;
      }
      }
      return;
    }


    function tagSeqsInitial(varTag,num, initialAttrIds, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected){

      if(num>=initialAttrIds.length){
        if(selected==true){
          medium.tagSelection3(varTag, userChosenAttributesAndValues, notCollapsedArgsTable[0], focusNode, notCollapsedArgsTable[1], focusOffset);
        }else{
          addCategoryWithTypeS (medium, varTag, userChosenAttributesAndValues, focusOffset,focusNode);
        }
        return;
      }
      var attrId=parseInt(initialAttrIds[num]);

      var categoryTypesHa=categorySeqHash[attrId];
      var attrName=categoryTypesHa['name'];
      var allow_user_input=categoryTypesHa['allow_user_input'];
      attrHash=categoryTypesHa['values'];
      var categoryTypesTable=Object.keys(attrHash); // categoryTypesTable now contains all the possible values of this attribute
      var i;
   

      //If an attribute has no predefined values and no user input possibility, give an error message
      if(categoryTypesTable.length==0 && allow_user_input==0){
        alert("There is an error in the attribute's "+attrName+" conception. It should either have predefined values or allow user input.");
      }else{
        //If there are predefined values for this attribute
        if(categoryTypesTable.length>0){
          //Create the new dropdown menu for category types
          newDropdown=addNewDropdown(categoryTypesTable.length,attrName, "Select");

          for(i=0; i< categoryTypesTable.length; i++){
            //Add an option for the category types dropdown menu
            addAnOption(newDropdown,categoryTypesTable[i]);
                    
            if(i==(categoryTypesTable.length-1)){
              if(onButton){
                $("#newDropdownDiv").css({'top':coords.y,'left':'','right':'4vw', 'position':'absolute'});
              }else{
                $("#newDropdownDiv").css({'top':coords.y,'left':coords.x,'right':'', 'position':'absolute'});
              }
            
              $("#newDropdownDiv").show();
              $('#select-type-input').show();
              $("#select-type-input")[0].value="";
              $('#select-type-input').focus();
              //$('#chosen-select-type').empty();
              $('#chosen-select-type')[0].value="";
              $("#chosen-select-type").show();

              if(allow_user_input==1){ //If the user can enter a new value for this attribute          
                $('#user-type-input').show();
                jQuery.fn.userInputAttrValueAdvancedInitial (0,$('#user-type-input'), medium, varTag,initialAttrIds,categorySeqHash, userChosenAttributesAndValues, attrName, num,categorySeqHash, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
              }

              $('#chosen-select-type').filterByTextAdvanced(0,$('#select-type-input'), medium, varTag,initialAttrIds, userChosenAttributesAndValues, attrName, attrHash,num,num,initialAttrIds,categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                     
              $("#chosen-select-type").off().change(attrName,function(event3){   

                if(event3.target == this){
                  type=$(this).val();
                  if(type!=null && type!=''){
                    newType=type;
                    type='';

                    userChosenAttributesAndValues.push([attrName,newType]);
                    $("#newDropdownDiv").hide();
                    $('#chosen-select-type').empty();
                    $('#chosen-select-type')[0].value="";
                    document.getElementById('select_a_tag').innerHTML = "";
                  
                    //If the chosen value has consequent attributes
                    if(Object.keys(attrHash).length>0 && attrHash[newType].length>0){

                      seqAttrsTable=attrHash[newType];

                      var numSeqAttr=0;
                      var seqAttrId=seqAttrsTable[numSeqAttr][0];
                      var seqAttrName=seqAttrsTable[numSeqAttr][1];

                      tagSeqs(1,varTag,initialAttrIds, num, numSeqAttr, seqAttrsTable, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                    }else{
                            
                      if (num<(initialAttrIds.length-1)){
                        tagSeqsInitial(varTag,num+1, initialAttrIds, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
                      }else if (num==(initialAttrIds.length-1)){
                        if(selected==true){
                          medium.tagSelection3(varTag, userChosenAttributesAndValues, notCollapsedArgsTable[0], focusNode, notCollapsedArgsTable[1], focusOffset);
                        }else{
                          addCategoryWithTypeS (medium, varTag, userChosenAttributesAndValues, focusOffset,focusNode);
                        }
                      }
                    }         
                  }
                }
                      
              });
            }
          }
        }else{ //If there are no predefined values for this attribute
          if(allow_user_input==1){ //If the user can enter a new value for this attribute
            //Create the new dropdown menu for category types
            newDropdown=addNewDropdown(categoryTypesTable.length,attrName, "Input");
            if(onButton){
              $("#newDropdownDiv").css({'top':coords.y,'left':'','right':'4vw', 'position':'absolute'});
            }else{
              $("#newDropdownDiv").css({'top':coords.y,'left':coords.x,'right':'', 'position':'absolute'});
            }
          
            $("#newDropdownDiv").show();
            $("#select-type-input").hide();
            $("#select-type-input")[0].value="";
            $('#chosen-select-type').empty();
            $('#chosen-select-type')[0].value="";
            $("#chosen-select-type").hide();          
            $('#user-type-input').show();
            $('#user-type-input').focus();
            jQuery.fn.userInputAttrValueAdvancedInitial (0,$('#user-type-input'), medium, varTag,initialAttrIds,categorySeqHash, userChosenAttributesAndValues, attrName, num,categorySeqHash, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton,selected);
          }else{ //The user can't enter a new value (erroneous case: the attribute exists, but has no values and can't obtain one)

            alert("There is a mistake in the attribute \""+attrName+"\" design: an attribute should either have a list of predefined values or allow user input.");
            return false;
          
          }
        }

      }
    }

    function getNextCollapsed(varTag,num, categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton){
            
      var categoryTypesTable=categoryTable[num][2];
      var attrName=categoryTable[num][0];
      var allow_user_input=categoryTable[num][1];        

      //If there are predefined values for this attribute
      if(categoryTypesTable.length>0){
        //Create the new dropdown menu for category types
        newDropdown=addNewDropdown(categoryTypesTable.length,attrName, "Select");

        for(i=0; i< categoryTypesTable.length; i++){
          //Add an option for the category types dropdown menu
          addAnOption(newDropdown,categoryTypesTable[i]);
                    
          if(i==(categoryTypesTable.length-1)){
            if(onButton){
              $("#newDropdownDiv").css({'top':coords.y,'left':'','right':'4vw', 'position':'absolute'});
            }else{
              $("#newDropdownDiv").css({'top':coords.y,'left':coords.x,'right':'', 'position':'absolute'});
            }
            
            $("#newDropdownDiv").show();
            $('#select-type-input').show();
            $("#select-type-input")[0].value="";
            $('#select-type-input').focus();
            //$('#chosen-select-type').empty();
            $("#chosen-select-type").show();

            if(allow_user_input==1){ //If the user can enter a new value for this attribute          
              $('#user-type-input').show();
              jQuery.fn.userInputAttrValueCollapsed ($('#user-type-input'), medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
            }

            $('#chosen-select-type').filterByTextCollapsed($('#select-type-input'), medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
                      
            $("#chosen-select-type").off().change(attrName,function(event3){                        
              document.getElementById('select_a_tag').innerHTML = "";                      
              if(event3.target == this){
                type=$(this).val();
                if(type!=null && type!=''){
                  newType=type;
                  type='';

                  userChosenAttributesAndValues.push([attrName,newType]);
                            
                  $("#newDropdownDiv").hide();
                  $('#chosen-select-type').empty();
                  $('#chosen-select-type')[0].value="";
                            
                  if (num<(categoryTable.length-1)){
                    getNextCollapsed(varTag,num+1, categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
                  }

                  if (num==(categoryTable.length-1)){
                    addCategoryWithTypeS (medium, varTag, userChosenAttributesAndValues, focusOffset,focusNode);
                  }
                            
                }
              }
                      
            });
          }
        }
      }else{ //If there are no predefined values for this attribute
        if(allow_user_input==1){ //If the user can enter a new value for this attribute
          //Create the new dropdown menu for category types
          newDropdown=addNewDropdown(categoryTypesTable.length,attrName, "Input");
          if(onButton){
            $("#newDropdownDiv").css({'top':coords.y,'left':'','right':'4vw', 'position':'absolute'});
          }else{
            $("#newDropdownDiv").css({'top':coords.y,'left':coords.x,'right':'', 'position':'absolute'});
          }
          
          $("#newDropdownDiv").show();
          $("#select-type-input").hide();
          $("#select-type-input")[0].value="";
          $('#chosen-select-type').empty();
          $('#chosen-select-type')[0].value="";
          $("#chosen-select-type").hide();          
          $('#user-type-input').show();
          $('#user-type-input').focus();
          jQuery.fn.userInputAttrValueCollapsed ($('#user-type-input'), medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
        }else{ //The user can't enter a new value (erroneous case: the attribute exists, but has no values and can't obtain one)

          alert("There is a mistake in the attribute \""+attrName+"\" design: an attribute should either have a list of predefined values or allow user input.");
          return false;
          
        }
      }
    }


    function collapsedNoAttributesInsertTag(varTag,focusOffset,focusNode){
      medium.focus();

      d = new Date();
      milliseconds = d.getTime();
      tagCode=milliseconds.toString();


      tagWithType='<'+varTag+' tagcode="'+tagCode+'" class="medium-'+varTag+'" mode="'+userChosenAttributesAndValues[0][1]+'">\u200B</'+varTag+'>';

      medium.focusNadya(focusOffset,focusNode);
      medium.insertHtmlNadya(tagWithType, focusOffset, focusNode);

      tagWithType='';
      $('.chosen-select-no-results').chosen_reset(config);
      $(".popupBody").hide();
      document.getElementById('select_a_tag').innerHTML = "";
                
      return false;
    }

    //Remove forbidden characters from an attribute's value
    function cleanAttrValue(val){
      val=$( $.parseHTML(val) ).text(); //Against malicious user input (a script in an input field)
      if(val==null || val==''){
        alert("The attribute's value is empty.");
      }
      return val.replace(/[<&"'>]+/g, "_");
    }

    //The user types the value of a category attribute in an input field
    jQuery.fn.userInputAttrValueSomethingSelected = function(textbox, medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton) {
      var option;
      var select;
      var options;
      var options2;
      var search;
      var regex;

        $(textbox).off().on('change keyup', function(e) {
          //If the user presses enter
          if (e.which == 13) {
            
              $("#newDropdownDiv").hide();
              $("#select-type-input").show();
              $("#select-type-input")[0].value="";
              $("#chosen-select-type").show();
              $('#chosen-select-type').empty();
              $('#chosen-select-type')[0].value="";
              $('#user-type-input').hide();
              document.getElementById('select_a_tag').innerHTML = "";


              userChosenAttributesAndValues.push([attrName,cleanAttrValue($(textbox).val())]);
              $(textbox).val('');
              if (num<(categoryTable.length-1)){
                getNextSomethingSelected(varTag, num+1, categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
              }

              if (num==(categoryTable.length-1)){
                medium.tagSelection3(varTag, userChosenAttributesAndValues, notCollapsedArgsTable[0], focusNode, notCollapsedArgsTable[1], focusOffset);

              }
            
          }
      });
    };


    //The user types the value of a category attribute
    jQuery.fn.userInputAttrValueCollapsed = function(textbox, medium, varTag, userChosenAttributesAndValues, attrName, num,categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton) {
      var option;
      var select;
      var options;
      var options2;
      var search;
      var regex;

        $(textbox).off().on('change keyup', function(e) {
          //If the user presses enter
          if (e.which == 13) {
            
              $("#newDropdownDiv").hide();
              $("#select-type-input").show();
              $("#select-type-input")[0].value="";
              $("#chosen-select-type").show();
              $('#chosen-select-type').empty();
              $('#chosen-select-type')[0].value="";
              $('#user-type-input').hide();
              document.getElementById('select_a_tag').innerHTML = "";

              userChosenAttributesAndValues.push([attrName,cleanAttrValue($(textbox).val())]);
              $(textbox).val('');
              if (num<(categoryTable.length-1)){
                  getNextCollapsed(varTag,num+1, categoryTable, focusOffset,focusNode, notCollapsedArgsTable,coords,onButton);
              }

              if (num==(categoryTable.length-1)){
                addCategoryWithTypeS (medium, varTag, userChosenAttributesAndValues, focusOffset,focusNode);
              }
            
          }
      });
      
    }


    //Add tag
    jQuery('#page_source_text').bind('keypress', hotkeysHash['insert_tag'], function(e) {
      if(Cookies.get('use_advanced_mode')==1){
        tagInAdvancedMode();
      }else{
        tagInSimpleMode();
      }
    });

    function buttonFunction(categoryid,categoryTag,coords){
      
      if(Cookies.get('use_advanced_mode')==1){
        tagButtonInAdvancedMode(categoryid,categoryTag,coords);
      }else{
        tagButtonInSimpleMode(categoryid,categoryTag,coords);
      }
    }

    function tagButtonInSimpleMode(categoryid,categoryTag,coords){
      userChosenAttributesAndValues=[['mode',0]];
      selection = window.getSelection();
      [focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
      notCollapsedArgsTable=[anchorNode,anchorOffset];

      if(categoryid in categoryTypesHash){
        if(selection.isCollapsed){
          //userChosenAttributesAndValues=[];
          var categoryTable=categoriesInfo[categoryid];
          getNextCollapsed(categoryTag,0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,true);
        }else{
          tagSelectionWithType(categoryid, categoriesInfo, medium, categoryTag, focusOffset, focusNode, [anchorNode, anchorOffset], coords,true);
        }
      }else{
        if(selection.isCollapsed){
          collapsedNoAttributesInsertTag(categoryTag,focusOffset,focusNode);
        }else{
          medium.tagSelection3(categoryTag, userChosenAttributesAndValues, anchorNode,focusNode,anchorOffset, focusOffset);
        }
      }
      //return false;
    }

    function tagButtonInAdvancedMode(categoryid,categoryTag,coords){
      userChosenAttributesAndValues=[['mode',1]];
      selection = window.getSelection();
      [focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();

      notCollapsedArgsTable=[anchorNode,anchorOffset];

      if(selection.isCollapsed){
        //If the category has types
        if(categoryid in categoryTypesHashAdv){
          
          //userChosenAttributesAndValues=[];

          var categorySeqHash=categoryTypesHashAdv[categoryid];
          var thisCategoryInitialAttrIds=[];
          if(initialAttrIds.hasOwnProperty(categoryid)){
            thisCategoryInitialAttrIds=initialAttrIds[categoryid];
          }else{
            thisCategoryInitialAttrIds=[];
          }

          tagSeqsInitial(categoryTag,0, thisCategoryInitialAttrIds, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,true,false);
                
        }else{ //If the category doesn't have types

          collapsedNoAttributesInsertTag(categoryTag,focusOffset,focusNode);

        }
      }else{ //If the selection is not collapsed
        //If the category has types
        if(categoryid in categoryTypesHashAdv){

          //userChosenAttributesAndValues=[];

          var categorySeqHash=categoryTypesHashAdv[categoryid];
          var thisCategoryInitialAttrIds=[];
          if(initialAttrIds.hasOwnProperty(categoryid)){
            thisCategoryInitialAttrIds=initialAttrIds[categoryid];
          }else{
            thisCategoryInitialAttrIds=[];
          }

          tagSeqsInitial(categoryTag,0, thisCategoryInitialAttrIds, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,true,true);
                  
        }else{ //If the category doesn't have types
          medium.tagSelection3(categoryTag, userChosenAttributesAndValues, anchorNode,focusNode,anchorOffset, focusOffset);
          //medium.tagSelection3(categoryTag, [], anchorNode,focusNode,anchorOffset, focusOffset);

          return false;
        }
      }
    }

    function tagInAdvancedMode(){
      userChosenAttributesAndValues=[['mode',1]];
      //var coords = getSelectionCoords();
      coords = getSelectionCoords();
      nowX=coords.x;
      nowY=coords.y;

      [focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
      notCollapsedArgsTable=[anchorNode,anchorOffset];
      selection = window.getSelection();

      //If the cursor is in the medium, but nothing has been selected
      if(selection.isCollapsed){
        $(".popupBodyAdv").css({'top':nowY,'left':nowX});
        $(".popupBodyAdv").show();
        $(".chosen-adv").trigger('chosen:activate');
        //$(".chosen-adv").show();
        

        $(".chosen-adv").chosen().change(function(event){
          if(event.target == this){
            $tag=$(this).val();
            if($tag!= null && $tag!=''){
              varTag=$tag;
              $tag='';
              options = $( ".chosen-adv option:selected" );
              categoryid=options[0].attributes[1].value;
              $('.chosen-adv').chosen_reset(config);
              $(".popupBodyAdv").hide();
              $(".popupBodyAdv").css({'top':0,'left':0});
              document.getElementById('select_a_tag').innerHTML = "";

              //If the category has types
              if(categoryid in categoryTypesHashAdv){
                
                //userChosenAttributesAndValues=[];

                var categorySeqHash=categoryTypesHashAdv[categoryid];
                var thisCategoryInitialAttrIds=[];
                if(initialAttrIds.hasOwnProperty(categoryid)){
                  thisCategoryInitialAttrIds=initialAttrIds[categoryid];
                }else{
                  thisCategoryInitialAttrIds=[];
                }

                tagSeqsInitial(varTag,0, thisCategoryInitialAttrIds, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,false,false);
                
              }else{ //If the category doesn't have types

                collapsedNoAttributesInsertTag(varTag,focusOffset,focusNode);

              }
            }
            return false;
          }
          return false;
        });

      }else{ //If selection is not collapsed: if something has been selected
        $(".popupBodyAdv2").css({'top':nowY,'left':nowX});
        $(".popupBodyAdv2").show();

        $(".chosen-adv2").trigger('chosen:activate');
          

        $(".chosen-adv2").chosen().change(function(event4){
          if(event4.target == this){
            $tag2=$(this).val();
            if($tag2!= null && $tag2!=''){
              varTag=$tag2;
              $tag2='';
              options = $( ".chosen-adv2 option:selected" );
              categoryid=options[0].attributes[1].value;
              //$('.chosen-select-no-results2').chosen_reset(config);
              $('.chosen-adv2').chosen_reset(config);
              $(".popupBodyAdv2").hide();
              $(".popupBodyAdv2").css({'top':0,'left':0});
              document.getElementById('select_a_tag').innerHTML = "";

              //If the category has types
              if(categoryid in categoryTypesHashAdv){
                userChosenAttributesAndValues=[['mode',1]];
                //userChosenAttributesAndValues=[];

                var categorySeqHash=categoryTypesHashAdv[categoryid];

                var thisCategoryInitialAttrIds=[];
                if(initialAttrIds.hasOwnProperty(categoryid)){
                  thisCategoryInitialAttrIds=initialAttrIds[categoryid];
                }else{
                  thisCategoryInitialAttrIds=[];
                }

                tagSeqsInitial(varTag,0, thisCategoryInitialAttrIds, categorySeqHash,focusOffset,focusNode, notCollapsedArgsTable,coords,false,true);
                  
              }else{ //If the category doesn't have types

                medium.tagSelection3(varTag, [], anchorNode,focusNode,anchorOffset, focusOffset);

                return false;
              }
            }
            return false;
          }
          return false;
        });
      }

    }
    
    //Add tag in simplemode
    function tagInSimpleMode() {
      userChosenAttributesAndValues=[['mode',0]];
      //var coords = getSelectionCoords();
      coords = getSelectionCoords();
      nowX=coords.x;
      nowY=coords.y;

      [focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
      notCollapsedArgsTable=[anchorNode,anchorOffset];
      selection = window.getSelection();


      //If the cursor is in the medium, but nothing has been selected
      if(selection.isCollapsed){
        $(".popupBody").css({'top':nowY,'left':nowX});
        $(".popupBody").show();

        $(".chosen-select-no-results").trigger('chosen:activate');

        $(".chosen-select-no-results").chosen().change(function(event){
          if(event.target == this){
            $tag=$(this).val();
            if($tag!= null && $tag!=''){
              varTag=$tag;
              $tag='';
              options = $( ".chosen-select-no-results option:selected" );
              categoryid=options[0].attributes[1].value;
              $('.chosen-select-no-results').chosen_reset(config);
              $(".popupBody").hide();
              $(".popupBody").css({'top':0,'left':0});
              document.getElementById('select_a_tag').innerHTML = "";

              //If the category has types
              if(categoryid in categoriesInfo){
                
                //userChosenAttributesAndValues=[];

                var categoryTable=categoriesInfo[categoryid];
                
                getNextCollapsed(varTag,0, categoryTable,focusOffset,focusNode, notCollapsedArgsTable,coords,false);
                
              }else{ //If the category doesn't have types

                collapsedNoAttributesInsertTag(varTag,focusOffset,focusNode);

              }
            }
            return false;
          }
          return false;
        });

      }else{ //If selection is not collapsed: if something has been selected
        $(".popupBody2").css({'top':nowY,'left':nowX});
        $(".popupBody2").show();

        $(".chosen-select-no-results2").trigger('chosen:activate');
          

        $(".chosen-select-no-results2").chosen().change(function(event4){
          if(event4.target == this){
            $tag2=$(this).val();
            if($tag2!= null && $tag2!=''){
              varTag=$tag2;
              $tag2='';
              options = $( ".chosen-select-no-results2 option:selected" );
              categoryid=options[0].attributes[1].value;
              $('.chosen-select-no-results2').chosen_reset(config);
              $(".popupBody2").hide();
              $(".popupBody2").css({'top':0,'left':0});
              document.getElementById('select_a_tag').innerHTML = "";

              //If the category has types
              if(categoryid in categoryTypesHash){
                tagSelectionWithType(categoryid, categoriesInfo, medium, varTag, focusOffset,focusNode, notCollapsedArgsTable, coords, false);
                  
              }else{ //If the category doesn't have types
                
                //medium.tagSelection3(varTag, [], anchorNode,focusNode,anchorOffset, focusOffset);
                medium.tagSelection3(varTag, userChosenAttributesAndValues, anchorNode,focusNode,anchorOffset, focusOffset);
                return false;
              }
            }
            return false;
          }
          return false;
        });

      } // End if selection.isCollapsed

      //return false;
    };


    article.highlight = function() {
      if (document.activeElement !== article) {
        medium.select();
      }
    };

    
    $( ".undo" ).mousedown(function() {
      medium.undo();
      return false;
    });

    $( ".delete_tag" ).mousedown(function() {
      position = $(this).offset();
      //var coords = {x:position.left, y:position.top};
      coords = {x:position.left, y:position.top};
      deleteTag(coords,true);
    });


    //Delete a tag
    jQuery('#page_source_text').bind('keypress', hotkeysHash['delete_tag'], function(e) {
      var coords = getSelectionCoords();
      deleteTag(coords,false);
    });


    $( ".change_tag" ).mousedown(function() {
      position = $(this).offset();
      //var coords = {x:position.left, y:position.top};
      coords = {x:position.left, y:position.top};
      changeTag(coords,true);
    });


    //Change a tag
    jQuery('#page_source_text').bind('keypress', hotkeysHash['modify_tag'], function(e) {
      coords = getSelectionCoords();
      changeTag(coords,false);
    });

    function findParents(){
      [focusOffset,focusNode,anchorOffset,anchorNode]=medium.returnOffset();
      var els = [];
      var a=anchorNode;

      //Find all the parents of the anchorNode (the node where the cursor or the beginning of the selection is)
      while (a!=null) {
        a = a.parentNode;
        if(a.id=="page_source_text"){
          break;
        }
        if(a.tagName!="DIV"){
          els.unshift(a);
        }
      }
      return els;
    }

    //Change a tag
    function changeTag(coords,onButton){
      if ( $("#change_div").css('display') == 'none' ){

      var els = findParents();

      //If the node has parent nodes (=tags)
      if(els.length>0){

        var i,
          name,
          nameTag,
          menuDiv=document.getElementById("change_div"),
          radio,
          label,
          button,
          hideDivButton=document.createElement('button');

          hideDivButton.className="hide_popup_button";
          hideDivButton.title=localStorage['hide_popup'] || 'Alt+R';
          hideDivButton.appendChild(document.createTextNode("\u26cc"));
          hideDivButton.onclick=function(){
            hideChangePopup(); 
          };
          menuDiv.appendChild(hideDivButton);

          var titlediv = document.createElement("div");
          titlediv.appendChild(document.createTextNode("Choose the tag to modify:"));
          titlediv.className="popup_title_div";
          menuDiv.appendChild(titlediv);


        //Create a menu
        for(i=0; i<els.length; i++){
          nameTag=els[i].nodeName;
          name=nameTag.replace(/_ID\d+$/g, "");
          radio = document.createElement('input');
          radio.type = "radio";
          radio.name = "change_tag_radio";
          radio.value = els[i].getAttribute('tagcode');
          radio.id = "change_radio_"+nameTag;
          label = document.createElement('label');
          label.htmlFor = "change_radio_"+nameTag;
          label.className=("medium-"+nameTag).toLowerCase();
          label.appendChild(document.createTextNode(name));
          menuDiv.appendChild(radio);
          menuDiv.appendChild(label);
          menuDiv.appendChild(document.createElement('br'));        
        }

        button = document.createElement('button');
        button.onclick = function(){
          changeSelectedTag(coords,onButton);
        };

        button.appendChild(document.createTextNode("Change the chosen tag"));
        menuDiv.appendChild(button);
        if(onButton==true){
          $("#change_div").css({'top':coords.y+20,'left':'','right':'4vw', 'position':'absolute'});
        }else{
          $("#change_div").css({'top':coords.y+20,'left':coords.x, 'right':'', 'position':'absolute'});
        }
        
        $("#change_div").show();
      }
      }
    }

    //Get all attributes of a node
    function getAttributes ($node) {
      var attrs = {};
      $.each( $node[0].attributes, function ( index, attribute ) {
        attrs[attribute.name] = attribute.value;
      } );

      return attrs;
    }

    function updateCorrespondingInput(inputId,newvalue){
      $("#"+inputId).val(newvalue);
    }

    function hideDeletionPopup(){
      $("#deletion_div").empty();
      $("#deletion_div").hide();
    }

    function hideChangePopup(){
      //Delete the radios from the menu div
      $('#change_div').empty();
      //Hide the menu
      $("#change_div").hide();
    }

    function hideChangeAttributesPopup(){
      //Delete the radios from the menu div
      $("#change_selected_div").empty();
      //Hide the menu
      $("#change_selected_div").hide();
    }

    //Functions that calls medium.js in order to remove the tags chosen via the popup menu checkboxes
    function changeSelectedTag(coords,onButton){

      //Get the checked tagcode
      var tagCodeToChange = $("input[name=change_tag_radio]:checked").val();

      //Delete the radios from the menu div
      $('#change_div').empty();
      //Hide the menu
      $("#change_div").hide();

      var attrs=getAttributes($("[tagcode="+tagCodeToChange+"]"));
      var tagName=$("[tagcode="+tagCodeToChange+"]").prop("tagName");
      var catId=tagName.match(/_ID(\d+)$/)[1];

      var div = document.getElementById("change_selected_div"),
          input,
          label,
          attrName,
          button,
          numberOfChangableAttrs=0,
          i,
          option,
          hideDivButton=document.createElement('button');


      hideDivButton.className="hide_popup_button";
      hideDivButton.title=localStorage['hide_popup'] || 'Alt+R';
      hideDivButton.appendChild(document.createTextNode("\u26cc"));
      hideDivButton.onclick=function(){
        hideChangeAttributesPopup(); 
      };
      div.appendChild(hideDivButton);

      var titlediv = document.createElement("div");
      var span=document.createElement("span");
      span.className=("medium-"+tagName).toLowerCase();
      span.appendChild(document.createTextNode(tagName.match(/^(.+)_ID\d+$/)[1]));
          
      titlediv.appendChild(document.createTextNode("Modify attribute values of the "));
      titlediv.appendChild(span);
      titlediv.appendChild(document.createTextNode(" tag:"));
      titlediv.className="popup_title_div";
      div.appendChild(titlediv);

      //var attrsHash=categoryTypesHash[parseInt(catId)];
      var attrsHashBefore={};
      var attrsHash={};

      //If the element was added in the advanced mode, we look for its attributes in the advanced mode hash. Otherwise we look for its attributes in the simple mode hash.
      if(attrs["mode"]=="1"){
        attrsHashBefore=categoryTypesHashAdv[parseInt(catId)];
        var key;
        for(key in attrsHashBefore){
          attrsHash[attrsHashBefore[key].name]={'allow_user_input':attrsHashBefore[key].allow_user_input,'values':Object.keys(attrsHashBefore[key].values)};
        }
      }else{
        attrsHash=categoryTypesHash[parseInt(catId)];
      }

      //Loop through all attributes of the chosen category
      for (attrName in attrs){
        if(attrName!='class' && attrName!='tagcode' && attrName!='mode'){
          //If the attribute is in the hash of attributes for this category (in case it had been deleted by the collection owner)
          if(attrsHash[attrName]!=null){
            label = document.createElement('label');
            label.setAttribute("for","value_"+attrName);
            label.setAttribute("class","popup_attribute_label");
            label.innerHTML = attrName;
            div.appendChild(label);
            numberOfChangableAttrs+=1;

            //If the user is allowed to type attribute values
            if(attrsHash[attrName]['allow_user_input']==1){
              input = document.createElement("input");
              input.type = "text";
              input.id = "value_"+attrName;
              input.value = attrs[attrName];
              input.name=tagCodeToChange;
              input.className="input_attribute_value_transcribe";
              div.appendChild(input);
            }

            //If there are predefined attributes
            if(attrsHash[attrName]['values'].length>0){
              //Create a dropdown to let the user select an attribute value from the list
              var select = document.createElement("select");
              select.className="input_attribute_value_transcribe";
              select.id = "value_"+attrName;
              select.name='select_'+tagCodeToChange;
              select.onchange=function(){
                updateCorrespondingInput(this.id,this.value);
              };


              for (i=0; i<attrsHash[attrName]['values'].length; i++){
                option = document.createElement("option");
                option.value=attrsHash[attrName]['values'][i];
                if(attrsHash[attrName]['values'][i]==attrs[attrName]){
                  option.selected="checked";
                }else{
                  option.selected="";
                }
                option.innerHTML=attrsHash[attrName]['values'][i];

                select.appendChild(option);
              }

              div.appendChild(select);
            }
          }
        }
      }


      if(numberOfChangableAttrs>0){
        button = document.createElement('button');
        button.onclick = function(){
          saveChangesInAttributeValues(tagCodeToChange);
        };

        button.appendChild(document.createTextNode("Save changes"));
        div.appendChild(button);
        
        if(onButton==true){
          $("#change_selected_div").css({'top':coords.y+20,'left':'','right':'4vw', 'position':'absolute'});
        }else{
          $("#change_selected_div").css({'top':coords.y+20,'left':coords.x,'right':'', 'position':'absolute'});
        }
        
        $("#change_selected_div").show();
      }else{
        $("#change_selected_div").hide();
        $("#change_selected_div").empty();
        alert("The tag "+tagName.match(/^(.+)_ID\d+$/)[1]+" has no attributes.");
      }
            
    }

    //Save changes the user made in the values of attributes of the chosen tag
    function saveChangesInAttributeValues(tagCode){
      //Get new values
      var el,
        nodeList=document.getElementsByName(tagCode),
        nodeListSelect=document.getElementsByName('select_'+tagCode),
        newAttrsValuesTable={},
        id;

      //Create a hash with attribute names and their new values
      //First put inside values from the drop down select
      if(nodeListSelect.length>0){
      for (el=0; el<nodeListSelect.length; el++){
        id=nodeListSelect[el].id.substring(6);
        newAttrsValuesTable[id]=nodeListSelect[el].value;

        if(el==(nodeListSelect.length-1)){
          if(nodeList.length>0){
          //Next put inside values from the input fields
          for (el=0; el<nodeList.length; el++){
            id=nodeList[el].id.substring(6);
            newAttrsValuesTable[id]=cleanAttrValue(nodeList[el].value);

            if(el==(nodeList.length-1)){
              $("#change_selected_div").hide();
              $("#change_selected_div").empty();
              medium.changeSelectedTag(tagCode,newAttrsValuesTable);
              return false;
            }
          }
          }else{
              $("#change_selected_div").hide();
              $("#change_selected_div").empty();
              medium.changeSelectedTag(tagCode,newAttrsValuesTable);
              return false;
          }
        }
      }
      }else{
        //Next put inside values from the input fields
          for (el=0; el<nodeList.length; el++){
            id=nodeList[el].id.substring(6);
            newAttrsValuesTable[id]=cleanAttrValue(nodeList[el].value);

            if(el==(nodeList.length-1)){
              $("#change_selected_div").hide();
              $("#change_selected_div").empty();
              medium.changeSelectedTag(tagCode,newAttrsValuesTable);
              return false;
          }
        }
      }
      
      
    }

    //Delete a tag
    function deleteTag(coords,onButton){
      if ( $("#deletion_div").css('display') == 'none' ){

      var els = findParents();

      //If the node has parent nodes (=tags)
      if(els.length>0){
        var i,
          name,
          nameTag,
          menuDiv=document.getElementById("deletion_div"),
          checkbox,
          label,
          button,
          hideDivButton=document.createElement('button');

          hideDivButton.className="hide_popup_button";
          hideDivButton.title=localStorage['hide_popup'] || 'Alt+R';
          hideDivButton.appendChild(document.createTextNode("\u26cc"));
          hideDivButton.onclick=function(){
            hideDeletionPopup(); 
          };
          menuDiv.appendChild(hideDivButton);

          var titlediv = document.createElement("div");
          titlediv.appendChild(document.createTextNode("Choose tag(s) to delete:"));
          titlediv.className="popup_title_div";
          menuDiv.appendChild(titlediv);


        //Create a menu
        for(i=0; i<els.length; i++){
          nameTag=els[i].nodeName;
          name=nameTag.replace(/_ID\d+$/g, "");
          checkbox = document.createElement('input');
          checkbox.type = "checkbox";
          checkbox.name = "delete_tag_checkbox";
          checkbox.value = els[i].getAttribute('tagcode');
          checkbox.id = "delete_checkbox_"+nameTag;
          label = document.createElement('label');
          label.htmlFor = "delete_checkbox_"+nameTag;
          label.className = "medium-"+nameTag.toLowerCase();
          label.appendChild(document.createTextNode(name));
          menuDiv.appendChild(checkbox);
          menuDiv.appendChild(label);
          menuDiv.appendChild(document.createElement('br'));        
        }

        button = document.createElement('button');
        button.onclick = function(){
          removeTag();
        };

        button.appendChild(document.createTextNode("Delete the chosen tag(s)"));
        menuDiv.appendChild(button);

        if(onButton==true){
          $("#deletion_div").css({'top':coords.y+20,'left':'','right':'4vw', 'position':'absolute'});
        }else{
          $("#deletion_div").css({'top':coords.y+20,'left':coords.x,'right':'', 'position':'absolute'});
        }
        $("#deletion_div").show();
      }
      }
    }

    // Pass the checkbox name to the function
    function getCheckedBoxes(chkboxName) {
      var checkboxes = document.getElementsByName(chkboxName);
      var checkboxesChecked = [];
      // loop over them all
      for (var i=0; i<checkboxes.length; i++) {
        // And stick the checked ones onto an array...
        if (checkboxes[i].checked) {
          checkboxesChecked.push(checkboxes[i].value);
        }
      }
      // Return the array if it is non-empty, or null
      return checkboxesChecked.length > 0 ? checkboxesChecked : null;
    }

    //Functions that calls medium.js in order to remove the tags chosen via the popup menu checkboxes
    function removeTag(){

      //Get the checked options
      var checkedTagcodes = getCheckedBoxes("delete_tag_checkbox");
      //Delete the checkboxes from the menu div
      $('#deletion_div').empty();
      //Hide the menu
      $("#deletion_div").hide();
      if(checkedTagcodes!=null && checkedTagcodes.length>0){
        medium.removeTags(checkedTagcodes);
      }
      
    }

    //Check if a string contains valid XML
    function isXML(xml){
      try {
        xmlDoc = $.parseXML(xml); //is valid XML
        return true;
      } catch (err) {
        // was not XML
        return false;
      }
    }
   

    //Add the transcription text to the form before sending it to the server
    function AddMediumValue() {
      mediumValue = medium.value();
      
      mediumValue = mediumValue.replace(/<br>/g, "<br></br>");

      mediumValue = mediumValue.replace(/\u200B/g, ""); //Delete invisible caracters inserted for +h and +c actions, because otherwise didn't work in webkit (chrome, safari)

      //mediumValue = mediumValue.replace(/&nbsp;/g, "&#160;"); // &nbsp; is not valid XML
      mediumValue = mediumValue.replace(/&nbsp;/g, " "); // &nbsp; is not valid XML

      if(mediumValue.match(/^<div id=\"bigDiv\">/)==null){
        mediumValue = "<div id=\"bigDiv\">"+mediumValue+"<\/div>";
      }

      if(isXML(mediumValue)){
        mediumValue = mediumValue.replace(/<div id=\"bigDiv\">/, '');
        mediumValue = mediumValue.replace(/<\/div>/, '');
        document.getElementsByName("page[source_text]")[0].value=mediumValue;
        return true;   // Returns Value
      }else{
        alert("The transcription contains tagging erros and can't be saved:\n"+mediumValue);
        return false;
      }

      
    }

});