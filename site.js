/// <reference path="jquery-1.7.1-vsdoc.js" />
var wallItemCount;
var showMoreWallItemCount;
var wallItemCommentCount;
var wallItemTextLength;

var latestCommentCount;
var showMoreLatestCommentsCount;

var showMoreBookmarkCount;
var showMoreContactCount;
var showMoreNewsCount;
var showMoreGalleriesCount;
var defaultDate;

var notifactionTime;

jQuery(document).ready(function () {
    /* menu 'tree'-functionality - kind of */
    function getSegments() {
        var url = self.location.href;
        var splits = url.replace('http://', '').split('/');
        //console.log("url: " + url + " segments > " + splits.length);
        var levels = 0;
        for (var k = 0; k < splits.length; k++) {
            console.log("segment nr" + k + " > " + splits[k]);
            switch (splits[k]) {
                case "ansatte":
                case "verktoy":
                case "omrader":
                case "personal":
                case "sosialt":
                    levels++;
                    break;
            }
        }
        return splits.length;
    }



    function findSubMenus() {
        //console.log("levels  > " + getSegments());
        //var len = $(".submenu ul").children().length;
        //console.log("li's -> " + len);

        //find active selected
        var all = $(".submenu > ul").find("li");
        //var selected = all.hasClass("selected");
        //console.log(">> all > " + all.length);
      
        for (var i = 0; i < all.length; i++) {
            //
            if ($(all[i]).hasClass("selected")) { //level 1
                //console.log("selected: " + i + " > " + $(all[i]).find("a").text());
                console.log("level 1");
                if ($(all[i]).find("ul")) { //level 2
                    console.log("   level 2");
                    $(all[i]).find("ul").children().each(function (i, el) {
                        //console.log(i + " > " + $(el).hasClass("selected"));
                        if ($(el).hasClass("selected")) {
                            if ($(el).find("ul")) { //level 3
                                console.log("       level 3");
                            }
                            //open both ul's
                            //$(all[i]).find("a:first").append("<span class='iconMenu'> - lukk</span>");
                            //$(all[i]).find("ul").show();
                        } else {
                            //$(all[i]).find("a").append("<span class='iconMenu'> - åpne</span>");
                            //$(all[i]).find("ul").hide();
                        }
                    });
                } 
               
            }
        } 
    };
    findSubMenus();

    $(".submenu > ul > li > ul > li > a").click(function (e) {
        console.log("level 2 clicked : " + $(this).text());
        $(".submenu > ul").find("li.selected").each(function (i) {
            console.log("-----------> " + i);
        });
    });

    $(".submenu > ul > li > a").click(function (e) {
        e.preventDefault();
        var current = $(this);
        $(".iconMenu").remove();
        var addText = "";
        /*if (current.parent("li").hasClass("selected")) {
            if (current.next("ul").hasClass("_opened")) {
                current.next("ul").removeClass("_opened");
                $(this).parent().find("ul").hide();
                addText = "åpne";
            } else {
                current.next("ul").addClass("_opened");
                $(this).parent().find("ul").fadeIn();
                addText = "lukk";
            }
            //console.log("active: " + $(this).text());
            addText == "åpne" ? addText = "<span class='iconMenu'> - åpne</span>" : addText = "<span class='iconMenu'> - lukk</span>";
            current.append(addText);
            return false;
        } else {
            window.location = $(this).attr("href");
        } */
        window.location = $(this).attr("href");
        //console.log("level 1 clicked " + $(this).text());
    });

    /* end menu */

    jQuery('.expandTrigger').click(function () {
        jQuery(this).parents('.boxList li').toggleClass("expanded");
        $(this).find('.hideWhenExpanded').toggleClass('hidden');
    });

    //notificationPanel
    jQuery('.notificationTrigger').click(function () {
        jQuery('.notifications').toggleClass("active");
    });

    //expanding textarea
    jQuery('.expandingTextArea').autoResize({
        // On resize:
        onResize: function () {
            $(this).css({ opacity: 0.8 });
        },
        // After resize:
        animateCallback: function () {
            $(this).css({ opacity: 1 });
        },
        // Quite slow animation:
        animateDuration: 300,
        // More extra space:
        extraSpace: 20
    });

    // Attach title tag to add MaintenanceMessage
    if (jQuery('#u_addMaintenanceMessage').length > 0) {
        attachTitleDiv(jQuery('#u_addMaintenanceMessage textarea'));
    }

    // Attach title tag to all text areas in comment lists
    if (jQuery('div.u_commentList').length > 0) {
        jQuery('div.u_commentList').each(function () {
            attachTitleDiv(jQuery(this).find('textarea[id$=uxCommentText]'));
            setupShowMoreCommentsLink(jQuery(this));
        });
    }

    // Attach datepicker to wallItem
    if (jQuery('#u_addWallitem').length > 0) {

        // Attach title tag to add wallitem
        attachTitleDiv(jQuery('#u_addWallitem textarea'));

        jQuery('#u_addWallitem input[id$=uxDate]').datetimepicker({ minDate: 0, showWeek: true, firstDay: 1, showOn: "both", buttonImage: "/Images/calendarIcon.gif", buttonImageOnly: true });

        // Attach notification
        setTimeout(checkForNewWallItems, notifactionTime);
    }
    if (jQuery('#u_LatestComments').length > 0) {
        // Attach notification
        setTimeout(checkForNewComments, notifactionTime);
    }
    var pageListNotification = jQuery('div.u_pageList');
    if (pageListNotification.length > 0) {
        pageListNotification.each(function () {
            var hiddenField = jQuery(this).find('input[id$=uxPageLinkHiddenValue]');
            if (hiddenField.length > 0 && hiddenField.val() !== '') {
                setTimeout(function () { checkForNewNewsItems(hiddenField.val()) }, notifactionTime);
            }
        });
    }

    if (jQuery('#u_addMaintenanceMessage').length > 0) {
        var hiddenField = jQuery('#u_addMaintenanceMessage input[id$=uxMaintenanceMessageContainer]');
        if (hiddenField.length > 0 && hiddenField.val() !== '') {
            setTimeout(function () { checkForNewMaintenanceItems(hiddenField.val()) }, notifactionTime);
        }

    }

    // Attach datepicker to my profile
    if (jQuery('div.myProfile').length > 0) {
        jQuery('div.myProfile input[id$=uxEmployeeDateTextBox]').datepicker({ maxDate: 0, changeMonth: true, changeYear: true, showWeek: true, firstDay: 1, showOn: "both", buttonImage: "/Images/calendarIcon.gif", buttonImageOnly: true });
    }

    showHideValidators();

    jQuery('form').bind('submit', function () { showHideValidators(); });

    setupSorter();

    if (jQuery('.fixed').length > 0) {

        // Fixed menu
        var msie6 = $.browser == 'msie' && $.browser.version < 7;

        if (!msie6) {
            var top = jQuery('.fixed').offset().top - parseFloat(jQuery('.fixed').css('margin-top').replace(/auto/, 0));
            jQuery(window).scroll(function (event) {
                // what the y position of the scroll is
                var y = jQuery(this).scrollTop() + 30;

                // whether that's below the form
                if (y >= top) {
                    // if so, ad the fixed class
                    jQuery('.fixed').addClass('fixedBox');
                } else {
                    // otherwise remove it
                    jQuery('.fixed').removeClass('fixedBox');
                }
            });
        }
    }

    // Attach change to department list radiobutton
    if (jQuery('#u_addWallitem span[id$=uxDepartmentList]').length > 0) {
        jQuery('#u_addWallitem span[id$=uxDepartmentList]').find(':radio').each(function () {
            var radioButton = jQuery(this);
            if (radioButton.val() === 'more') {
                radioButton.change(function () {
                    jQuery('#u_addWallitem div.moreChoices').removeClass('hidden');
                });
            }
            else {
                radioButton.change(function () {
                    jQuery('#u_addWallitem div.moreChoices').addClass('hidden');
                });
            }
        });
    }

    // show/hide orgchart
    jQuery('.orgChartToggle.open').click(function () {
        jQuery('.orgChart.collapsed').removeClass('showChart');
        jQuery('.orgChart.expanded').addClass('showChart');
    });
    jQuery('.orgChartToggle.close').click(function () {
        jQuery('.orgChart.collapsed').addClass('showChart');
        jQuery('.orgChart.expanded').removeClass('showChart');
    });

    if (jQuery('#u_exchange').length > 0) {
        loadCalendar();
    }

    if (jQuery('#u_feedback').length > 0) {
        attachTitleDiv(jQuery('#u_feedback textarea'));
    }

    jQuery("div#u_addMaintenanceMessage .saveMessage").click(function (e) {
        $(this).SaveMessageLog({ id: $(this).attr("name") });
        e.preventDefault();
    });

    //Removing default option from list...
    jQuery("div#u_addMaintenanceMessage .systemList option:first").remove();

    jQuery("#u_addMaintenanceMessage .systemList").click(onSystemSelectChange);
    jQuery("#u_addMaintenanceMessage .selectedSystemList").click(onSysSelSelectChange);

    jQuery(".description .showMore").click(function (e) {
        var container = $(this).parent("div.logItemButtons");
        var id = $(this).attr("name");

        $(container).prev(".logContainer").MessageLog({ id: id });
        $(container).children(".showLess").removeClass("hidden");
        $(container).children(".showMore").addClass("hidden");
        $(".uxActivityDescription").addClass("hidden");

        e.preventDefault();
    });

    jQuery(".description .showLess").click(function (e) {
        var container = $(this).parent("div.logItemButtons");

        $(container).prev(".logContainer").contents().remove();
        $(container).children(".showLess").addClass("hidden");
        $(container).children(".showMore").removeClass("hidden");
        $(".uxActivityDescription").removeClass("hidden");

        e.preventDefault();
    });

    jQuery(".newMaintenanceMessage").click(function (e) {
        resetDropDown();
        SetDialogBoxMode();

        fadeLightBox(true, 'u_addMaintenanceMessage');
        e.preventDefault();
    });

    jQuery(".editMessageContainer a").click(function (e) {
        var container = $(this).parent();

        var id = $(this).attr("name");
        var status = $(container).children("#editStatus").val();
        var systems = $(container).children("#editSystems").val();

        resetDropDown();
        SetDialogBoxMode(id);

        $(".versionListBox").MessageLog({ id: id });

        $("div#u_addMaintenanceMessage .editStatus").val(status);
        $("div#u_addMaintenanceMessage .selectedSystemList").SelectedList({ systems: systems.split(","), targetSelect: $("div#u_addMaintenanceMessage .systemList") });

        fadeLightBox(true, 'u_addMaintenanceMessage');
        e.preventDefault();
    });

    //Add calendar item
    jQuery(".uxAddCalendarItem").click(function (e) {
        fadeLightBox(true, "u_addCalendarItem");
        e.preventDefault();
    });

    jQuery(".uxDatePicker").datepicker({ maxDate: "+12m", changeMonth: true, changeYear: true, showWeek: true, firstDay: 1, showOn: "both", buttonImage: "/Images/calendarIcon.gif", buttonImageOnly: true });

    jQuery("#u_addCalendarItem .uxCreateBtn").click(function (e) {
        if (ClientValidateCalendarEvent()) {
            $(this).CreateCalendarEvent({ id: $("#u_addCalendarItem #uxListRootID").val() });
            document.location.reload();
        }
        e.preventDefault();
    });
});

function onSystemSelectChange() {
    var selected = $(".systemList option:selected");
    if (selected.val() != 0) {
        $(".selectedSystemList").append(selected);
    }
}

function onSysSelSelectChange() {
    var selected = $(".selectedSystemList option:selected");
    if (selected.val() != 0) {
        $(".systemList").append(selected);
    }
}

// Wall item functions
function saveWallItem() {
    var textArea = jQuery('#u_addWallitem textarea[id$=uxWallItemText]');
    var stopPublish = jQuery('#u_addWallitem input[id$=uxDate]');
    var validFor = jQuery('#u_addWallitem span[id$=uxDepartmentList]').length > 0 && jQuery('#u_addWallitem span[id$=uxDepartmentList]').find(':radio:checked').length > 0 ? jQuery('#u_addWallitem span[id$=uxDepartmentList]').find(':radio:checked').val() : '';
    var moreChoices = '';
    jQuery('#u_addWallitem span[id$=uxAllDepartments]').find(':checkbox:checked').each(function () {
        moreChoices += jQuery(this).next().text();
        moreChoices += ', ';
    });

    var textAreaOk = false;
    var dateOk = false;
    var radioButtonOk = false;
    
    if (textArea.val() === '' || textArea.val() === textArea.attr('title')) {
        textAreaOk = false;
        textArea.prevAll('span.u_validator').removeClass('hidden');
    }
    else {
        textAreaOk = true;
        textArea.prevAll('span.u_validator').addClass('hidden');
    }

    if (defaultDate && stopPublish.val() === '') {
        dateOk = false;
        stopPublish.prevAll('span.u_validator').removeClass('hidden');
    } 
    else {
        dateOk = true;
        stopPublish.prevAll('span.u_validator').addClass('hidden');
    }

    if (jQuery('#u_addWallitem span[id$=uxDepartmentList]').length > 0 && validFor === '' && moreChoices === '' || (validFor === 'more' && moreChoices === '')) {
        radioButtonOk = false;
        jQuery('#u_addWallitem span[id$=uxDepartmentList]').prevAll('span.u_validator').removeClass('hidden');
    }
    else {
        radioButtonOk = true;
        jQuery('#u_addWallitem span[id$=uxDepartmentList]').prevAll('span.u_validator').addClass('hidden');
    }

    if (textAreaOk && dateOk && radioButtonOk) {
        addWallItem();
    }
    
    return false;
}

function addWallItem() {
    addWait();

    var pageIdValue = jQuery('#u_addWallitem input[id$=uxPageIdHidden]').val();
    var wallItemText = jQuery('#u_addWallitem textarea[id$=uxWallItemText]').val();
    var stopPublish = jQuery('#u_addWallitem input[id$=uxDate]').val();
    var validFor = jQuery('#u_addWallitem span[id$=uxDepartmentList]').length > 0 ? jQuery('#u_addWallitem span[id$=uxDepartmentList]').find(':radio:checked').val() : '';
    var moreChoices = '';
    jQuery('#u_addWallitem span[id$=uxAllDepartments]').find(':checkbox:checked').each(function () {
        moreChoices += jQuery(this).next().text();
        moreChoices += ', ';
    });

    if(pageIdValue) {
        $.ajax({
            url: '/Services/WallService.asmx/EditWallItem',
            type: 'POST',
            data: "{ pageId: " + pageIdValue + ", wallText: '" + wallItemText + "', stopPublish: '" + stopPublish + "', validFor: '" + validFor + "', moreChoices: '" + moreChoices + "' }",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (data, textStatus, jqXHR) {
                removeWait();
                if (data.d.length > 0) {
                    var wallItem = jQuery('#u_WallItem' + pageIdValue);
                    // Add data
                    wallItem.before(data.d);
                    // Remove first element
                    wallItem.remove();
                    // Empty input boxes and close
                    closeSaveWallItem();
                }
                else {
                    alert('Something went wrong when editing wall item. Please try again');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                removeWait();
                alert('Something went wrong when editing wall item. Please try again');
            }
        });
    }

    else {
        var wallItemContainer = parseInt(jQuery('#u_addWallitem input[id$=uxWallItemContainer]').val());
        $.ajax({
            url: '/Services/WallService.asmx/AddWallItem',
            type: 'POST',
            data: "{ wallItemContainer: " + wallItemContainer + ", wallText: '" + wallItemText + "', stopPublish: '" + stopPublish + "', validFor: '" + validFor + "', moreChoices: '" + moreChoices + "' }",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (data, textStatus, jqXHR) {
                removeWait();
                if (data.d.length > 0) {
                    // Remove empty template
                    var noItems = jQuery('#u_WallItems li.u_noItems');
                    if (noItems && noItems.length > 0) {
                        noItems.remove();
                    }

                    // Add data
                    jQuery('ul#u_WallItems').prepend(data.d);
                    // Empty input boxes and close
                    closeSaveWallItem();
                }
                else {
                    alert('Something went wrong when saving wall item. Please try again');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                removeWait();
                alert('Something went wrong when saving wall item. Please try again');
            }
        });    
    }
}

function removeWallItem(pageId) {
    addWait();
    $.ajax({
        url: '/Services/WallService.asmx/DeleteWallItem',
        type: 'POST',
        data: { pageId: pageId },
        async: false,
        success: function (data, textStatus, jqXHR) {
            jQuery('#u_WallItem' + pageId).remove();
            removeWait();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            removeWait();
            alert('Something went wrong when saving wall item. Please try again');
        }
    });
    return false;
}

function editWallItem(pageId) {

    $.ajax({
        url: '/Services/WallService.asmx/GetWallItem',
        type: 'POST',
        data: "{ pageId: " + pageId + " }",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data, textStatus, jqXHR) {
            var wallItemInput = jQuery('div#u_addWallitem');
            // Set page id
            wallItemInput.find('input[id$=uxPageIdHidden]').val(data.d.PageId);
            // Set wall item text
            var wallItemText = wallItemInput.find('textarea[id$=uxWallItemText]');
            wallItemText.val(data.d.WallItemText);
            // Set stop publish
            wallItemInput.find('input[id$=uxDate]').val(data.d.StopPublish);
            // Set radio button
            if(wallItemInput.find('span[id$=uxDepartmentList]').length > 0) {
                var validFor = data.d.ValidFor;

                var radioButtons = wallItemInput.find('span[id$=uxDepartmentList]').find(':radio');
                for (var i = 0; i < radioButtons.length; i++) {
                    var radioButton = jQuery(radioButtons[i]);
                    if (radioButton.val() === validFor) {
                        radioButton.attr("checked", "checked");
                        break;
                    }
                }

                if (validFor === 'more' && data.d.Departments.length > 0) {
                    var checkBoxes = jQuery('#u_addWallitem span[id$=uxAllDepartments]').find(':checkbox');
                    for (var j = 0; j < data.d.Departments.length; j++) {
                        var selectedDepartment = data.d.Departments[j];
                        for (var k = 0; k < checkBoxes.length; k++) {
                            var checkBox = jQuery(checkBoxes[k]);
                            if (checkBox.next().text() === selectedDepartment) {
                                checkBox.attr("checked", "checked");
                                break;
                            }
                        }
                    }

                    jQuery('#u_addWallitem div.moreChoices').removeClass('hidden');
                }
            }
            
            // trigger lightbox
            fadeLightBox(true, 'u_addWallitem');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Something went wrong when getting wall item. Please try again');
        }
    });

    return false;
}

function closeSaveWallItem() {
    emptyInputWallItemBoxes();
    jQuery('#u_addWallitem span.u_validator').each(function () {
        jQuery(this).addClass('hidden');
    });

    // Close lightbox
    fadeLightBox(false, 'u_addWallitem');
}

function emptyInputWallItemBoxes() {
    // Empty all input parameters
    jQuery('#u_addWallitem input[id$=uxPageIdHidden]').val('');
    jQuery('#u_addWallitem textarea[id$=uxWallItemText]').val('');
    jQuery('#u_addWallitem input[id$=uxDate]').val(defaultDate ? defaultDate : '');
    jQuery('#u_addWallitem span[id$=uxDepartmentList]').find(':radio:checked').attr('checked', false);
    jQuery('#u_addWallitem span[id$=uxAllDepartments]').find(':checkbox:checked').each(function () {
        jQuery(this).attr('checked', false);
    });
    jQuery('#u_addWallitem div.moreChoices').addClass('hidden');
    // Attach title tag to add wallitem
    attachTitleDiv(jQuery('#u_addWallitem textarea'));
}

function checkForNewWallItems() {
    var wallItemContainer = parseInt(jQuery('#u_addWallitem input[id$=uxWallItemContainer]').val());
    var messagePlaceholder = jQuery('#u_newMessageWall');
    $.ajax({
        url: '/Services/WallService.asmx/CheckForNewWallItems',
        type: 'POST',
        data: "{ wallItemContainer: " + wallItemContainer + " }",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data, textStatus, jqXHR) {
            if (data.d) {
                messagePlaceholder.removeClass('hidden');
            } 
            else {
                // Attach notification
                setTimeout(checkForNewWallItems, notifactionTime); 
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Attach notification
            setTimeout(checkForNewWallItems, notifactionTime); 
        }
    });
}

// Like functions
function addLike(link, pageId) {
    addWait();

    var likeIdHidden = jQuery(link).parent().find('input[id$=uxLikeId]');

    $.ajax({
        url: '/Services/WallService.asmx/AddLike',
        type: 'POST',
        data: "{ pageId: '" + pageId + "' }",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data, textStatus, jqXHR) {
            // Get like link
            var addLikeLink = jQuery(link);
            addLikeLink.toggle();
            // Get unlike link
            addLikeLink.next().toggle();

            // Check if like is on page
            var likePersonCountOnPage = addLikeLink.parents('div.articleLike').find('a.u_likeLinkPersonCount_' + pageId);
            if (likePersonCountOnPage.length > 0) {
                likePersonCountOnPage.text(data.d.LikePersonCountLinkText);
            }
            else {
                // Update like count
                addLikeLink.parent().find('span.likeIcon').text(data.d.LikeCountLinkText);
                jQuery('#u_commentList_' + pageId).find('a.u_likeLinkPersonCount_' + pageId).text(data.d.LikePersonCountLinkText);
            }

            // Set like id hidden
            likeIdHidden.val(data.d.LikeId);

            removeWait();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            removeWait();
            alert('Something went wrong when adding like. Please try again');
        }
    });

    return false;
}

function removeLike(link, pageId) {
    addWait();

    var likeIdHidden = jQuery(link).parent().find('input[id$=uxLikeId]');
    var likeId = likeIdHidden.val();

    $.ajax({
        url: '/Services/WallService.asmx/DeleteLike',
        type: 'POST',
        data: "{ pageId: '" + pageId + "', likeId: '" + likeId + "' }",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data, textStatus, jqXHR) {
            // Get unlike link
            var removeLikeLink = jQuery(link);
            removeLikeLink.toggle();
            // Get like link
            removeLikeLink.prev().toggle();

            // Check if like is on page
            var likePersonCountOnPage = removeLikeLink.parents('div.articleLike').find('a.u_likeLinkPersonCount_' + pageId);
            if (likePersonCountOnPage.length > 0) {
                likePersonCountOnPage.text(data.d.LikePersonCountLinkText);
            }
            else {
                // Update like count
                removeLikeLink.parent().find('span.likeIcon').text(data.d.LikeCountLinkText);
                jQuery('#u_commentList_' + pageId).find('a.u_likeLinkPersonCount_' + pageId).text(data.d.LikePersonCountLinkText);
            }
            // Reset like id
            likeIdHidden.val('');

            removeWait();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            removeWait();
            alert('Something went wrong when removind like. Please try again');
        }
    });

    return false;
}

function fillLikeList(likeListId) {
    addWait();

    // Get list
    var likeList = jQuery('#' + likeListId + ' ul.likes');

    // Empty like list
    likeList.html('');
    
    // Get likes
    $.ajax({
        url: '/Services/WallService.asmx/GetLikes',
        type: 'POST',
        data: "{ pageId: '" + likeListId.substr(11) + "' }",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data, textStatus, jqXHR) {
            likeList.html(data.d);
            removeWait();
            fadeLightBox(true, likeListId);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            removeWait();
            alert('Something went wrong when getting people for like. Please try again');
        }
    });

    return false;
}

// Comment functions
function addComment(link, isPageComment) {
    var commentList = jQuery(link).closest('div.u_commentList');
    var textArea = commentList.find('textarea[id$=uxCommentText]');
    if (textArea.val() !== '' && textArea.val() !== textArea.attr('title')) {
        var pageId = commentList.attr('id').substr(14);
        var commentText = textArea.val();

        addWait();
        $.ajax({
            url: '/Services/WallService.asmx/AddComment',
            type: 'POST',
            data: "{ pageId: " + pageId + ", commentText: '" + commentText + "', isPageComment: " + isPageComment + " }",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (data, textStatus, jqXHR) {
                
                if(!isPageComment) {
                    // Update link text
                    var showAllLink = commentList.find('a.u_commentLinkPersonCount');
                    if (showAllLink.length > 0) {
                        showAllLink.text(data.d.CommentPersonCountLinkText);
                    }

                    jQuery('#u_WallItem' + pageId).find('span.commentIcon').text(data.d.CommentCountLinkText);

                    // Add comment
                    commentList.find('ul.u_listOfComments li.u_addComment').before(data.d.CommentTemplateText);
                } 
                else {
                    // Add comment
                    commentList.find('ul.u_listOfComments').append(data.d.CommentTemplateText);    
                }

                // Update comment box
                textArea.prevAll('span.u_validator').addClass('hidden');
                textArea.val('');
                textArea.focus();
                textArea.nextAll('span.u_commentCount').text('0');
                
                removeWait();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                removeWait();
                alert('Something went wrong when saving comment. Please try again');
            }
        });
    } 
    else {
        textArea.prevAll('span.u_validator').removeClass('hidden');
    }
    
    return false;
}

function removeComment(link, commentId, isPageComment) {
    addWait();
    var commentList = jQuery(link).closest('div.u_commentList');
    var pageId = commentList.attr('id').substr(14);

    $.ajax({
        url: '/Services/WallService.asmx/DeleteComment',
        type: 'POST',
        data: "{ pageId: " + pageId + ", commentId: '" + commentId + "' }",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data, textStatus, jqXHR) {
            
            if(!isPageComment) {
                // Update link text
                var showAllLink = commentList.find('a.u_commentLinkPersonCount');
                if (showAllLink.length > 0) {
                    showAllLink.text(data.d.CommentPersonCountLinkText);
                }

                jQuery('#u_WallItem' + pageId).find('span.commentIcon').text(data.d.CommentCountLinkText);
            }
            
            // Remove comment
            jQuery(link).closest('li.u_commentItem').remove();

            removeWait();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            removeWait();
            alert('Something went wrong when deleting comment. Please try again');
        }
    });

    return false;
}

function toggleComments(listId) {
    var list = jQuery('#' + listId);
    var display = list.css('display');
    if (display == 'none') {
        list.removeClass('hidden');
    }
    else {
        list.addClass('hidden');
    }
    return false;
}

function showAllComments(link, listId) {
    addWait();
    
    var commentList = jQuery('#' + listId + ' ul.u_listOfComments');
    commentList.html('');

    // Get likes
    $.ajax({
        url: '/Services/WallService.asmx/GetComments',
        type: 'POST',
        data: "{ pageId: " + listId.substr(14) + " }",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data, textStatus, jqXHR) {
            commentList.html(data.d);
            jQuery(link).closest('div.content').remove();
            removeWait();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            removeWait();
            alert('Something went wrong when getting people for like. Please try again');
        }
    });
    return false;
}

function setupShowMoreCommentsLink(commentList) {
    var list = jQuery(commentList);
    var comments = list.find('ul li.u_commentItem');
    var numberOfComments = comments.length;
    if (numberOfComments > wallItemCommentCount) {
        for (var i = 0; i < (numberOfComments - wallItemCommentCount); i++) {
            jQuery(comments[i]).hide();
        }
    }
}

function setCommentFieldActicve(element, commentListId) {
    var list = jQuery('#' + commentListId);
    var display = list.css('display');
    if (display == 'none') {
        list.removeClass('hidden');
    }
    var commentField = list.find('li.u_addComment textarea[id$=uxCommentText]');
    if(commentField) {
        commentField.focus();
    }
    return false;
}

function checkForNewComments() {
    var messagePlaceholder = jQuery('#u_newMessageLatestComments');
    
    $.ajax({
        url: '/Services/WallService.asmx/CheckForNewComments',
        type: 'POST',
        data: "{ }",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data, textStatus, jqXHR) {
            if (data.d) {
                messagePlaceholder.removeClass('hidden');
            }
            else {
                // Attach notification
                setTimeout(checkForNewComments, notifactionTime);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Attach notification
            setTimeout(checkForNewComments, notifactionTime);
        }
    });
}

// Tools functions
function addTool(link, pageId) {
    $.ajax({
        url: '/Services/ToolsService.asmx/AddTool',
        type: 'POST',
        data: { toolId: pageId },
        async: false,
        success: function (data, textStatus, jqXHR) {
            // Hide add link
            jQuery(link).hide();
            // Show remove link
            jQuery(link).next().show();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Something went wrong when adding tool. Please try again');
        }
    });

    return false;
}

function removeTool(link, pageId) {

    $.ajax({
        url: '/Services/ToolsService.asmx/RemoveTool',
        type: 'POST',
        data: { toolId: pageId },
        async: false,
        success: function (data, textStatus, jqXHR) {
            // Hide remove link
            jQuery(link).hide();
            // Show add link
            jQuery(link).prev().show();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Something went wrong when removing tool. Please try again');
        }
    });

    return false;
}

function removeToolAndReload(pageId) {
    addWait();

    $.ajax({
        url: '/Services/ToolsService.asmx/RemoveTool',
        type: 'POST',
        data: { toolId: pageId },
        async: false,
        success: function (data, textStatus, jqXHR) {
            location.reload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            removeWait();
            alert('Something went wrong when removing tool. Please try again');
        }
    });

    return false;
}

// Contact functions
function addContactAndReload(pageId) {
    addWait();

    $.ajax({
        url: '/Services/ContactService.asmx/AddContact',
        type: 'POST',
        data: { contactId: pageId },
        async: false,
        success: function (data, textStatus, jqXHR) {
            location.reload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            removeWait();
            alert('Something went wrong when adding contact. Please try again');
        }
    });

    return false;
}

function addContact(link, pageId) {
    $.ajax({
        url: '/Services/ContactService.asmx/AddContact',
        type: 'POST',
        data: { contactId: pageId },
        async: false,
        success: function (data, textStatus, jqXHR) {
            // Update all links on page
            jQuery('a.u_addContact' + pageId).each(function () {
                jQuery(this).hide();
            });

            jQuery('a.u_removeContact' + pageId).each(function () {
                jQuery(this).show();
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Something went wrong when adding contact. Please try again');
        }
    });

    return false;
}

function removeContactAndReload(pageId) {
    addWait();

    $.ajax({
        url: '/Services/ContactService.asmx/RemoveContact',
        type: 'POST',
        data: { contactId: pageId },
        async: false,
        success: function (data, textStatus, jqXHR) {
            location.reload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            removeWait();
            alert('Something went wrong when removing contact. Please try again');
        }
    });

    return false;
}

function removeContact(link, pageId) {

    $.ajax({
        url: '/Services/ContactService.asmx/RemoveContact',
        type: 'POST',
        data: { contactId: pageId },
        async: false,
        success: function (data, textStatus, jqXHR) {
            // Update all links on page
            jQuery('a.u_addContact' + pageId).each(function () {
                jQuery(this).show();
            });

            jQuery('a.u_removeContact' + pageId).each(function () {
                jQuery(this).hide();
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('Something went wrong when removing contact. Please try again');
        }
    });

    return false;
}

// Bookmark functions
function addBookmarkAndReload(pageId) {
    addWait();

    $.ajax({
        url: '/Services/BookmarksService.asmx/AddBookmark',
        type: 'POST',
        data: { bookmarkId: pageId },
        async: false,
        success: function (data, textStatus, jqXHR) {
            location.reload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            removeWait();
            alert('Something went wrong when adding bookmark. Please try again');
        }
    });

    return false;
}

function removeBookmarkAndReload(pageId) {
    addWait();

    $.ajax({
        url: '/Services/BookmarksService.asmx/RemoveBookmark',
        type: 'POST',
        data: { bookmarkId: pageId },
        async: false,
        success: function (data, textStatus, jqXHR) {
            location.reload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            removeWait();
            alert('Something went wrong when removing bookmark. Please try again');
        }
    });

    return false;
}

// Maintenance message functions
function resetDropDown() {
    jQuery("div#u_addMaintenanceMessage .sendMessage").show();
    jQuery("div#u_addMaintenanceMessage .saveMessage").hide();
    jQuery("div#u_addMaintenanceMessage .statusList").addClass("hidden");
    jQuery("div#u_addMaintenanceMessage .editStatus").val('');
    jQuery('#u_addMaintenanceMessage .versionList').addClass("hidden");
    jQuery('#u_addMaintenanceMessage .versionListBox').html('');
    jQuery('#u_addMaintenanceMessage .u_system select').val('');
    jQuery('#u_addMaintenanceMessage textarea[id$=uxMaintenanceMessageText]').val('');
    jQuery('#u_addMaintenanceMessage input[id$=uxMaintenanceMessageSubject]').val('');
    jQuery('#u_addMaintenanceMessage span.u_Counter').text('0');
    jQuery('#u_addMaintenanceMessage span.u_validator').addClass('hidden');
    jQuery('#u_addMaintenanceMessage .u_system').removeClass('hidden');
    jQuery('#u_addMaintenanceMessage .u_subject').removeClass('hidden');
    jQuery('#u_addMaintenanceMessage .u_comment').removeClass('hidden');
    jQuery('#u_addMaintenanceMessage .u_buttons').removeClass('hidden');
    jQuery('#u_addMaintenanceMessage .u_responseMessage').addClass('hidden');
    jQuery('#u_addMaintenanceMessage .selectedSystemList').find('option').each(function () {
        $(".systemList").append($(this));
    });
    
    return false;
}

function saveMaintenanceMessage () {
    var maintenanceMessageText = jQuery('#u_addMaintenanceMessage textarea[id$=uxMaintenanceMessageText]');
    var subject = jQuery('#u_addMaintenanceMessage input[id$=uxMaintenanceMessageSubject]');
    var messageSystemDropDownSelectedText = $.map($(".selectedSystemList option"), function (el, i) {
        return $(el).text();
    });

    console.log(messageSystemDropDownSelectedText);
    addWait();
    
    var reciever = jQuery('#u_addMaintenanceMessage input[id$=uxCrmEmailReciever]').val();
    var sender = jQuery('#u_addMaintenanceMessage input[id$=uxCrmEmailSender]').val();

    if (ValidateMessage()) {
        $.ajax({
            url: '/Services/SystemMessageService.asmx/SendSystemMessageItem',
            type: 'POST',
            data: { problemItemText: maintenanceMessageText.val(), system: messageSystemDropDownSelectedText.join(","), subject: subject.val(), reciever: reciever, sender: sender },
            async: false,
            success: function (data, textStatus, jqXHR) {
                removeWait();
                ShowConfirmation();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                removeWait();
                alert('Something went wrong when sending maintenance message on email. Please try again');
            }
        });
    }

    else {
        removeWait();
    }
    
    return false;
}

function sendFeedBack() {
    addWait();

    jQuery('#u_feedback p.u_responseMessage').hide();

    var feedbackMessageText = jQuery('#u_feedback textarea[id$=uxFeedbackMessageText]');
    var reciever = jQuery('#u_feedback input[id$=uxFeedBackEmailReciever]').val();

    if (feedbackMessageText.val() === '' || feedbackMessageText.val() === feedbackMessageText.attr('title')) {
        feedbackMessageText.prevAll('span.u_validator').removeClass('hidden');
    }
    else {
        feedbackMessageText.prevAll('span.u_validator').addClass('hidden');

        $.ajax({
            url: '/Services/FeedbackService.asmx/SendFeedbackMessage',
            type: 'POST',
            data: { feedbackText: feedbackMessageText.val(), reciever: reciever },
            async: false,
            success: function (data, textStatus, jqXHR) {
                removeWait();
                feedbackMessageText.val('');
                attachTitleDiv(feedbackMessageText);
                jQuery('#u_feedback p.u_responseMessage').show();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                removeWait();
                alert('Something went wrong when sending feed message on email. Please try again');
            }
        });
    }

    removeWait();

    return false;
}

function checkForNewMaintenanceItems(containerId) {
    var messagePlaceholder = jQuery('#u_newMessageMaintenance');

    $.ajax({
        url: '/Services/SystemMessageService.asmx/CheckForNewMaintenanceMessageItems',
        type: 'POST',
        data: "{ maintenanceContainer: " + containerId + " }",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data, textStatus, jqXHR) {
            if (data.d) {
                messagePlaceholder.removeClass('hidden');
            }
            else {
                // Attach notification
                setTimeout(function () { checkForNewMaintenanceItems(containerId) }, notifactionTime);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Attach notification
            setTimeout(function () { checkForNewMaintenanceItems(containerId) }, notifactionTime);
        }
    });
}

// Image functions
function openImageLightBox(divId) {
    var modalBox = jQuery('#' + divId);
    var image = modalBox.find('img[id$=uxAlterImage]');
    image.Jcrop({
        onSelect: storeCoords,
        onChange: storeCoords,
        aspectRatio: 1
        });
    fadeLightBox(true, divId);
}

function storeCoords(c) {
    jQuery('input[id$=xCoords]').val(c.x);
    jQuery('input[id$=yCoords]').val(c.y);
    jQuery('input[id$=wCoords]').val(c.w);
    jQuery('input[id$=hCoords]').val(c.h);
}

function closeImageLightBox(divId) {
    fadeLightBox(false, divId);
}

function cropImage(divId) {
    var modalBox = jQuery('#' + divId);
    var alterImage = modalBox.find('img[id$=uxAlterImage]');
    var profileImage = jQuery('img[id$=uxPersonProfileImage]');
    var profileImageUrlHidden = jQuery('input[id$=uxProfileImageUrl]');
    var xCord = parseInt(jQuery('input[id$=xCoords]').val());
    var yCord = parseInt(jQuery('input[id$=yCoords]').val());
    var width = parseInt(jQuery('input[id$=wCoords]').val());
    var height = parseInt(jQuery('input[id$=hCoords]').val());

    if (xCord >= 0 && yCord >= 0 && width > 0 && height > 0) {
        addWait();
        $.ajax({
            url: '/Services/ImageService.asmx/SaveImage',
            type: 'POST',
            data: '{ "imageUrl": "' + alterImage.attr('src') + '", "xCordinate": "' + xCord + '", "yCordinate": "' + yCord + '", "widht": "' + width + '", "height": "' + height + '"}',
            contentType: 'application/json; charset=utf-8',
            async: false,
            success: function (data, textStatus, jqXHR) {

                if (data.d.ParsedImageUrl.indexOf('?') == -1) {
                    data.d.ParsedImageUrl += '?';
                } else {
                    data.d.ParsedImageUrl += '&';
                }
                data.d.ParsedImageUrl += '__rnd=' + Math.random();

                profileImage.attr('src', data.d.ParsedImageUrl);
                profileImageUrlHidden.val(data.d.ProfileImageUrl);
                closeImageLightBox(divId);
                removeWait();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                removeWait();
                alert('Something went wrong when saving image. Please try again');
            }
        });
    }
    else {
        alterImage.Jcrop({
            onSelect: storeCoords,
            onChange: storeCoords,
            aspectRatio: 1
        });
        alert('Please select a crop region then press submit.');
    }
    
    return false;
}

// Problem functions
function saveProblemItem() {
    var textArea = jQuery('#u_addProblemItem textarea[id$=uxProblemItemText]');
    if (Page_ClientValidate('AddProblemItemValidationGroup') && textArea.val() !== textArea.attr('title')) {
        addProblemItem();
    }

    else {
        Page_BlockSubmit = false;
    }

    showHideValidators();

    return false;
}

function addProblemItem() {
    addWait();

    var problemItemTitle = jQuery('#u_addProblemItem input[id$=uxTitle]').val();
    var problemItemText = jQuery('#u_addProblemItem textarea[id$=uxProblemItemText]').val();
    var problemContainer = parseInt(jQuery('#u_addProblemItem input[id$=uxProblemItemContainer]').val());

    $.ajax({
        url: '/Services/SystemMessageService.asmx/AddSystemMessageItem',
        type: 'POST',
        data: { problemContainer: problemContainer, problemItemTitle: problemItemTitle, problemItemText: problemItemText },
        async: false,
        success: function (data, textStatus, jqXHR) {
            location.reload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            removeWait();
            alert('Something went wrong when saving problem item. Please try again');
        }
    });
}

// Lightbox functions
function fadeLightBox(show, divId) {
    if (show) {
        var x = jQuery(window).scrollTop();
        var topPos = x + 50;
        jQuery('#' + divId).css({ top: topPos });
        jQuery('#' + divId).css('display', 'block');
        jQuery('#disableScreen').css('height', jQuery(document).height() + 'px');
        jQuery('#disableScreen').css('display', 'block');
    }
    else {
        jQuery('#' + divId).css('display', 'none');
        jQuery('#disableScreen').css('display', 'none');
    }
    return false;
}

function closeLightBox(divId) {
    addWait();
    
    fadeLightBox(false, divId);

    location.reload();
}

function resizeModal(elementId, elementToReadFrom) {
    var element = jQuery('#' + elementId);
    if(element && element.length > 0) {
        var read = element.find(elementToReadFrom);
        if (read && read.length > 0) {
            element.css('width', read.width() + 35 + 'px');
            element.css('margin-left', '-' + read.width() / 2 + 'px');
        }
    }
    return false;
}

// Word counter function
function checkMaxLength(event, sender, maxLen) {
    return (sender.value.length < maxLen) || (event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 116 || event.keyCode == 46 || (event.keyCode >= 35 && event.keyCode <= 40));
}

function truncate(e, sender, maxLen) {
    // Because IE sucks, only truncate when max length is reached
    if (sender.value.length > maxLen) {
        sender.value = sender.value.substring(0, maxLen);
    }
    jQuery(sender).next().html(sender.value.length);
}

function checkMaxLengthWithEnterKey(event, sender, maxLen) {
    if(event.keyCode == 13) {
        return addComment(sender, false);
    }
    return (sender.value.length < maxLen) || (event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 116 || event.keyCode == 46 || (event.keyCode >= 35 && event.keyCode <= 40));
}

// Title function
function attachTitleDiv(element) {
    var inputElement = jQuery(element);

    var titleValue = inputElement.attr('title');

    inputElement.val(titleValue);
    inputElement.focus(function () {
        if (inputElement.val() === titleValue) {
            inputElement.val('');
        }
    });
    inputElement.blur(function () {
        if (inputElement.val() === '') {
            inputElement.val(titleValue);
        }
    });
}

function setupSorter() {

    // Sorter for tools
    jQuery('div.u_toolsList ul.boxList').sortable({ update: function (event, ui) {

        // Add wait
        addWait();

        // Get sorted list
        var ids = new Array();
        jQuery('div.u_toolsList ul.boxList li').each(function () {
            ids.push(jQuery(this).find('a.remove').attr('id').substr(6));
        });

        var updateOk = false;

        $.ajax({
            url: '/Services/ToolsService.asmx/UpdateTools',
            type: 'POST',
            data: { toolIds: ids.join(',') },
            async: false,
            success: function (data, textStatus, jqXHR) {
                // Remove wait
                removeWait();

                updateOk = true;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Remove wait
                removeWait();

                alert('Something went wrong when saving sorting of tools. Please try again');
            }
        });

        return updateOk;
    }
    });
    jQuery('div.u_toolsList ul.boxList').disableSelection();

    // Sorter for contacts
    jQuery('div.u_contactList ul.boxList').sortable({ update: function (event, ui) {

        // Add wait
        addWait();

        // Get sorted list
        var ids = new Array();
        jQuery('div.u_contactList ul.boxList li').each(function () {
            ids.push(jQuery(this).find('a.remove').attr('id').substr(9));
        });

        var updateOk = false;

        $.ajax({
            url: '/Services/ContactService.asmx/UpdateContacts',
            type: 'POST',
            data: { contactIds: ids.join(',') },
            async: false,
            success: function (data, textStatus, jqXHR) {
                // Remove wait
                removeWait();

                updateOk = true;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Remove wait
                removeWait();

                alert('Something went wrong when saving sorting of contacts. Please try again');
            }
        });

        return updateOk;
    }
    });
    jQuery('div.u_contactList ul.boxList').disableSelection();

    // Sorter for bookmarks
    jQuery('div.u_bookmarkList table.boxList tbody').sortable({ update: function (event, ui) {

        // Add wait
        addWait();

        // Get sorted list
        var ids = new Array();
        jQuery('div.u_bookmarkList table.boxList tbody tr').each(function () {
            ids.push(jQuery(this).find('a.remove').attr('id').substr(10));
        });

        var updateOk = false;

        $.ajax({
            url: '/Services/BookmarksService.asmx/UpdateBookmarks',
            type: 'POST',
            data: { bookmarkIds: ids.join(',') },
            async: false,
            success: function (data, textStatus, jqXHR) {
                // Remove wait
                removeWait();

                updateOk = true;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Remove wait
                removeWait();

                alert('Something went wrong when saving sorting of contacts. Please try again');
            }
        });

        return updateOk;
    }
    });
    jQuery('div.u_bookmarkList table.boxList').disableSelection();
}

function showHideValidators() {
    jQuery('span.validator').each(function () {
        if (jQuery(this).css('visibility') == 'hidden') {
            jQuery(this).css('display', 'none');
        }
        else {
            jQuery(this).css('display', 'block');
        }
    });
}

// Toggle functions
function toggleWallItems(link, showMore, defaultCount) {
    addWait();

    var wrapperDiv = jQuery(link).closest('div.center');
    var showMoreLink = wrapperDiv.find('a.showMore');
    var showLessLink = wrapperDiv.find('a.showLess');

    var wallItemContainer = parseInt(jQuery('#u_addWallitem input[id$=uxWallItemContainer]').val());
    
    if(showMore) {
        $.ajax({
            url: '/Services/WallService.asmx/GetMoreWallItems',
            type: 'POST',
            data: "{ containerId: " + wallItemContainer + ", currentCount: " + wallItemCount + ", showMoreCount: " + showMoreWallItemCount + " }",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (data, textStatus, jqXHR) {
                if (data.d) {
                    // Remove empty template
                    var noItems = jQuery('#u_WallItems li.u_noItems');
                    if (noItems && noItems.length > 0) {
                        noItems.remove();
                    }

                    // Add data
                    jQuery('ul#u_WallItems').append(data.d.WallItems);

                    // Update current count
                    wallItemCount = data.d.CurrentCount;

                    // Remove more link
                    if (data.d.RemoveMoreLink) {
                        showMoreLink.addClass('hidden');
                    }
                    // Show more link
                    else {
                        showMoreLink.removeClass('hidden');
                    }
                   
                    // Show less link
                    showLessLink.removeClass('hidden');

                    removeWait();
                }
                else {
                    removeWait();
                    alert('Something went wrong when saving wall item. Please try again');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                removeWait();
                alert('Something went wrong when getting more wall items. Please try again');
            }
        });
    } 
    else {
        var wallItems = jQuery('ul#u_WallItems li.u_wallItem');
        if (wallItems.length > 0) {

            // Remove items
            for (var i = wallItems.length - 1; i >= defaultCount; i--) {
                jQuery(wallItems[i]).remove();
            }

            // Update current count
            wallItemCount = jQuery('ul#u_WallItems li.u_wallItem').length;

            // Show more link
            showMoreLink.removeClass('hidden');

            // Remove less link
            showLessLink.addClass('hidden');
        }
        removeWait();  
    }

    return false;
}

function toggleLatestComments(link, showMore, defaultCount) {
    addWait();

    var wrapperDiv = jQuery(link).closest('div.center');
    var showMoreLink = wrapperDiv.find('a.showMore');
    var showLessLink = wrapperDiv.find('a.showLess');

    if(showMore) {
        $.ajax({
            url: '/Services/WallService.asmx/GetMoreComments',
            type: 'POST',
            data: "{ currentCount: " + latestCommentCount + ", showMoreCount: " + showMoreLatestCommentsCount + " }",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (data, textStatus, jqXHR) {
                if (data.d) {
                    // Remove empty template
                    var noItems = jQuery('#u_LatestComments tbody tr.u_noItems');
                    if (noItems && noItems.length > 0) {
                        noItems.remove();
                    }

                    // Add data
                    jQuery('#u_LatestComments tbody').append(data.d.Comments);

                    // Update current count
                    latestCommentCount = data.d.CurrentCount;

                    // Remove more link
                    if (data.d.RemoveMoreLink) {
                        showMoreLink.addClass('hidden');
                    }
                    // Show more link
                    else {
                        showMoreLink.removeClass('hidden');
                    }

                    // Show less link
                    showLessLink.removeClass('hidden');

                    removeWait();
                }
                else {
                    removeWait();
                    alert('Something went wrong when saving wall item. Please try again');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                removeWait();
                alert('Something went wrong when getting more wall items. Please try again');
            }
        });
    } 
    else {
        var comments = jQuery('#u_LatestComments tbody tr');
        if (comments.length > 0) {

            // Remove items
            for (var i = comments.length - 1; i >= defaultCount; i--) {
                jQuery(comments[i]).remove();
            }

            // Update current count
            latestCommentCount = jQuery('#u_LatestComments tbody tr').length;

            // Show more link
            showMoreLink.removeClass('hidden');

            // Remove less link
            showLessLink.addClass('hidden');
        }
        removeWait();  
    }

    return false;
}

function toggleContacts(link) {
    return toggleMoreItems(jQuery(link).closest('div.u_contactList').find('ul.boxList li'), showMoreContactCount, link);
}

function toggleBookmarks(link) {
    return toggleMoreItems(jQuery(link).closest('div.u_bookmarkList').find('table.boxList tbody tr'), showMoreBookmarkCount, link);
}

function toggleNews(link) {
    var collection = new Array();
    jQuery(link).closest('div.listPage').find('ul.contentList').each(function () {
        jQuery(this).find('li').each(function () {
            collection.push(jQuery(this));
        });
    });
    return toggleMoreItems(collection, showMoreNewsCount, link);
}

function toggleGalleries(link) {
    return toggleMoreItems(jQuery('div.main').find('ul.albumList li'), showMoreGalleriesCount, jQuery(link).closest('div.center'));
}

function toggleMoreItems(collection, stepCount, elementToRemove) {
    
    var collectionCount = collection.length;
    var i = 0;
    var numberOfOpenItems = 0;

    for (var j = 0; j < collectionCount; j++) {
        if (i === stepCount) {
            break;
        }
        var element = jQuery(collection[j]);
        var display = element.css('display');
        if (display === 'none') {
            element.show();
            i++;
        }
        else {
            numberOfOpenItems++;
        }
    }

    if (numberOfOpenItems + i >= collectionCount) {
        jQuery(elementToRemove).remove();
    }

    return false;
}

// Calendar functions
function loadCalendar() {
    addWaitExchange();
    jQuery('#u_exchange li.u_errormessage').addClass('hidden');
    var pageIdValue = jQuery('#u_exchange input[id$=uxPersonPage]').val();
    $.ajax({
        url: '/Services/ExchangeService.asmx/GetExchangeCalendar',
        type: 'POST',
        data: "{ pageId: " + pageIdValue + " }",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data, textStatus, jqXHR) {
            removeWaitExchange();
            if (data.d) {
                // Add data
                jQuery('#u_exchange ul.u_today').prepend(data.d.Today);
                jQuery('#u_exchange ul.u_tomorrow').prepend(data.d.Tomorrow);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            jQuery('#u_exchange li.u_errormessage').removeClass('hidden');
            removeWaitExchange();
        }
    });
}

function toggleCalendar(linkElement) {
    var link = jQuery(linkElement);
    if (link.hasClass('u_today')) {
        jQuery('ul.u_today').addClass('hidden');
        jQuery('a.u_today').addClass('hidden');

        jQuery('ul.u_tomorrow').removeClass('hidden');
        jQuery('a.u_tomorrow').removeClass('hidden');
    }
    else {
        jQuery('ul.u_today').removeClass('hidden');
        jQuery('a.u_today').removeClass('hidden');

        jQuery('ul.u_tomorrow').addClass('hidden');
        jQuery('a.u_tomorrow').addClass('hidden');
    }
    
    return false;
}

function checkForNewNewsItems(containerId) {
    var messagePlaceholder = jQuery('#u_newMessagePageList');
    $.ajax({
        url: '/Services/NewsService.asmx/CheckForNewNewsItems',
        type: 'POST',
        data: "{ newsContainer: " + containerId + " }",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data, textStatus, jqXHR) {
            if (data.d) {
                messagePlaceholder.removeClass('hidden');
            }
            else {
                // Attach notification
                setTimeout(function () { checkForNewNewsItems(containerId) }, notifactionTime);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Attach notification
            setTimeout(function () { checkForNewNewsItems(containerId) }, notifactionTime);
        }
    });
}

function deletePage(pageIdToDelete, deleteText, redirectUrl) {
    if(confirm(deleteText)) {
        $.ajax({
            url: '/Services/NewsService.asmx/DeleteNewsPage',
            type: 'POST',
            data: { pageId: pageIdToDelete },
            async: true,
            success: function (data, textStatus, jqXHR) {
                window.location = redirectUrl;

            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('Could not delete page. Please try again.');
            }
        });
    }
    return false;
}

function ShowConfirmation() {
    jQuery('#u_addMaintenanceMessage .versionList').addClass('hidden');
    jQuery('#u_addMaintenanceMessage .statusList').addClass('hidden');
    jQuery('#u_addMaintenanceMessage .u_system').addClass('hidden');
    jQuery('#u_addMaintenanceMessage .u_subject').addClass('hidden');
    jQuery('#u_addMaintenanceMessage .u_comment').addClass('hidden');
    jQuery('#u_addMaintenanceMessage .u_buttons').addClass('hidden');
    jQuery('#u_addMaintenanceMessage .u_responseMessage').removeClass('hidden');
}

function ValidateMessage() {
    var maintenanceMessageText = jQuery('#u_addMaintenanceMessage textarea[id$=uxMaintenanceMessageText]');
    var subject = jQuery('#u_addMaintenanceMessage input[id$=uxMaintenanceMessageSubject]');
    var dropDown = jQuery(".selectedSystemList option");

    var textAreaOk = false;
    var dropDownOk = false;
    var subjectOk = false;

    if (maintenanceMessageText.val() === '' || maintenanceMessageText.val() === maintenanceMessageText.attr('title')) {
        textAreaOk = false;
        maintenanceMessageText.prevAll('span.u_validator').removeClass('hidden');
    }
    else {
        textAreaOk = true;
        maintenanceMessageText.prevAll('span.u_validator').addClass('hidden');
    }

    if (subject.val() === '') {
        subjectOk = false;
        subject.prevAll('span.u_validator').removeClass('hidden');
    }
    else {
        subjectOk = true;
        subject.prevAll('span.u_validator').addClass('hidden');
    }

    if (jQuery(dropDown).length == 0) {
        jQuery(".selectedSystemList").prevAll('span.u_validator').removeClass('hidden');
    } 
    else 
    {
        jQuery(".selectedSystemList").prevAll('span.u_validator').addClass('hidden');
        dropDownOk = true;
    }

    return textAreaOk && dropDownOk && subjectOk;
}

// Wait functions
function addWait() {
    jQuery('body').append('<div id="u_wait" style="height:' + jQuery(document).height() + 'px;"><div class="inner"><img src="/Images/ajax-loader-bar.gif" alt="Innhold lastes" /></div></div>');
}

function removeWait() {
    jQuery('div#u_wait').remove();
}

function addWaitExchange() {
    jQuery('#u_exchange').append('<div id="u_exchangeWait"><div class="inner"><img src="/Images/ajax-loader.gif" alt="Innhold lastes" /></div></div>');
}

function removeWaitExchange() {
    jQuery('div#u_exchangeWait').remove();
}

function setCookieValueForDefaultFolderPath(folderPath) { $.ajax({ url: '/Services/SetCookieService.asmx/SetCookieValueForDefaultFolderPath', type: 'POST', data: { folderPath: '" + DefaultFolderValue + "' }, async: false, success: function (data, textStatus, jqXHR) { }, error: function (jqXHR, textStatus, errorThrown) { } }); }

/* Javascript for Activitylog */

function ClientValidateActivtyWindow()
{
    var heading = $(".uxheading");
    var status = $(".activityStatus");
    var validation = true;

    if (heading.val() === '' || heading.val() === heading.attr('title')) {
        validation = false;
        heading.prevAll('span.u_validator').removeClass('hidden');
    }

    if ($(status).find('input:radio:checked').length == 0) {
        validation = false;
        status.prevAll('span.u_validator').removeClass('hidden');
    }

    return validation;
}

function ClearActivityWindow() {
    $("#u_addActivity .uxheading").val("");
    tinyMCE.activeEditor.setContent("");
    $("#u_addActivity .activityStatus input").removeAttr("checked"); ;
    $("#u_addActivity .uxStatusComment").val("");
    $("#u_addActivity .uxPageId").val("");
    $("#u_addActivity .u_validator").addClass("hidden");
}

(function ($) {
    $.fn.sorted = function (customOptions) {
        var options = {
            reversed: false,
            by: function (a) { return a.text(); }
        };
        $.extend(options, customOptions);
        $data = $(this);
        arr = $data.get();
        arr.sort(function (a, b) {
            var valA = options.by($(a));
            var valB = options.by($(b));
            if (options.reversed) {
                return (valA < valB) ? 1 : (valA > valB) ? -1 : 0;
            } else {
                return (valA < valB) ? -1 : (valA > valB) ? 1 : 0;
            }
        });
        return $(arr);
    };
})(jQuery);

/* Javascript for MessageLog */

function SetDialogBoxMode(id) {
    $("div#u_addMaintenanceMessage .statusList").removeClass("hidden");
    $("div#u_addMaintenanceMessage .sendMessage").hide();
    $("div#u_addMaintenanceMessage .saveMessage").show();

    if (id) {
        $("div#u_addMaintenanceMessage .versionList").removeClass("hidden");
        $("div#u_addMaintenanceMessage .saveMessage").attr("name", id);
    } else {
        $("div#u_addMaintenanceMessage .saveMessage").attr("name", "null");
    }
}

jQuery.fn.SelectedList = function () {
    var element = $(this[0]) // It's your element
    var args = arguments[0] || {}; // It's your object of arguments
    var valueArray = args.systems;
    var targetSelect = args.targetSelect;

    for (var i = 0, length = valueArray.length; i < length; i++) {
        var sys = valueArray[i];
        var option = $(targetSelect).children("option[value=" + sys + "]");
        $(element).append(option);
    }
};

jQuery.fn.MessageLog = function () {
    var element = $(this[0]) // It's your element
    var args = arguments[0] || {}; // It's your object of arguments
    var messageId = args.id;

    addWait();

    $.ajax({
        url: '/Services/SystemMessageService.asmx/GetSystemMessageItemLog',
        type: 'POST',
        data: "{ messageSystemId: " + messageId + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data, textStatus, jqXHR) {
            jQuery.each(data.d, function (i, stringInList) {
                $(element).append('<p class="logItem">' + stringInList + '</p>');
                $(element).append('<br />');
            });

            $(element).parent().show();
            removeWait();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            removeWait();
            alert('Something went wrong when fetching version history. Please try again');
        }
    });
};

jQuery.fn.SaveMessageLog = function () {
    var element = $(this[0]) // It's your element
    var args = arguments[0] || {}; // It's your object of arguments
    var messageId = args.id;

    if (!ValidateMessage()) {
        return;
    }

    addWait();

    var selMulti = $.map($(".selectedSystemList option"), function (el, i) {
        return $(el).val();
    });

    var jsonData = "messageSystemId: " + messageId + ", status: '" + $(".editStatus").val() + "',listOfSystems: '" + selMulti.join(", ") + "',title: '" + $(".messageTitle").val() + "',description: '" + $(".messageDescription").val() + "'";

    $.ajax({
        url: '/Services/SystemMessageService.asmx/SaveMaintenanceMessage',
        type: 'POST',
        data: "{ " + jsonData + " }",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data, textStatus, jqXHR) {
            fadeLightBox(false, "u_addMaintenanceMessage");
            $("#u_newMessageMaintenance").removeClass("hidden");
            removeWait();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            removeWait();
            alert('Something went wrong when saving data. Please try again');
        }
    });
};

/* Calendar */
function ClientValidateCalendarEvent() {
    var heading = $("#u_addCalendarItem .uxHeading");
    var startdate = $("#u_addCalendarItem .uxStartDate");
    var validation = true;

    if (heading.val() === '' || heading.val() === heading.attr('title')) {
        validation = false;
        heading.prevAll('span.u_validator').removeClass('hidden');
    }

    if (startdate.val() === '' || startdate.val() === startdate.attr('title')) {
        validation = false;
        startdate.prevAll('span.u_validator').removeClass('hidden');
    }

    return validation;
}

function ClearCalendarEvent() {
    $("#u_addCalendarItem .uxHeading").val("");
    $("#u_addCalendarItem .uxStartDate").val("");
    $("#u_addCalendarItem .uxStopDate").val("");
    $("#u_addCalendarItem .uxFullDay input[type='checkbox']").prop('checked', false);
    $("#u_addCalendarItem .uxCalendarEventDesc").val("");
}

jQuery.fn.CreateCalendarEvent = function () {
    var element = $(this[0]) // It's your element
    var args = arguments[0] || {}; // It's your object of arguments
    var messageId = args.id;

    addWait();

    var jsonData = "calendarRoot:" + messageId + ",heading:'" + $("#u_addCalendarItem .uxHeading").val() + "',startDate:'" + $("#u_addCalendarItem .uxStartDate").val() + "',stopDate:'" + $("#u_addCalendarItem .uxStopDate").val() + "',fullday:'" + $("#u_addCalendarItem .uxFullDay input[type='checkbox']").prop('checked') + "',description:'" + $("#u_addCalendarItem .uxCalendarEventDesc").val() + "'";
    $.ajax({
        url: '/Services/CalendarService.asmx/CreateCalenderEvent',
        type: 'POST',
        data: "{ " + jsonData + " }",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data, textStatus, jqXHR) {
            fadeLightBox(false, "u_addCalendarItem");
            ClearCalendarEvent();
            removeWait();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            removeWait();
            alert('Something went wrong when saving data. Please try again');
        }
    });
};