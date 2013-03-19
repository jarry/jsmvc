/**
 * Baidu UE JavaScript Library - Web Control
 * 
 * calendar.js
 * @author UTer
 * @version $Revision: 1.13 $
 */


/**
 * �����ؼ�
 * <pre>
 * <h3>����������˵����</h3>
 * onselect���û�ѡ������ʱ�����¼�
 * onviewchange:�����Ӿ������л�ʱ�����¼�
 * dateStyle��������ʽ����ΪString��Function
 * 
 * <h3>ʾ����</h3>
 * var myCalendar = new Calendar({
 *     onselect: function (date) {
 *         if (date.getDate() == 1){alert('������ѡ1��');return false;}
 *         G("ShowDate").innerHTML = "��ѡ���������:" + date.getFullYear() + "��" + (date.getMonth()+1) + "��" + date.getDate() + "��";
 *     },
 *     dateStyle: function (date) {
 *         if(date.getDay() == 0 || date.getDay() == 6) return "background:#eee";
 *     }
 * });
 * myCalendar.appendTo(document.body);
 * </pre>
 * 
 * @param {Object} params ���ڳ�ʼ���ؼ������Լ���
 */
function Calendar(params) {
    this.uniqueId = getUniqueId();
    
    params = params || {};
    this.date = params.date || new Date();
    this.viewDate = new Date(Date.parse(this.date));
    
    this.onselect = params.onselect || new Function();
    this.onviewchange = params.onviewchange || new Function();
    this.dateStyle = params.dateStyle || "";
    
    this.wrapId = this.uniqueId + 'Calendar';
    this.headId = this.uniqueId + 'Head';
    this.bodyId = this.uniqueId + 'Body';
    this.titleId = this.uniqueId + 'Title';
    
    this.wrapClass            = "calendar-wrap";
    this.headClass            = "calendar-head";
    this.bodyClass            = "calendar-body";
    this.titleClass            = "calendar-title";
    this.prevMonthClass        = "calendar-prev-month";
    this.prevYearClass        = "calendar-prev-year";
    this.nextMonthClass        = "calendar-next-month";
    this.nextYearClass        = "calendar-next-year";
}

/**
 * ������ڵ�ǰ�·ݵ�����
 * 
 * @private
 * @param {Date} ����
 * @return {Number} ����
 */
Calendar.getDateCountByMonth = function (date) {
    var d = new Date(date);
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    return d.getDate();
};

Calendar.prototype = {
    /**
     * ��������
     * 
     * @public
     * @param {Date} date ����
     */
    setDate: function (date) {
        this.date = date;
        this.viewDate = new Date(Date.parse(date));
        G(this.bodyId).innerHTML = this.getBodyHtml();
        G(this.titleId).innerHTML = this.getTitleHtml();
    },
    
    /**
     * ���ؼ����ӵ�ҳ������
     * 
     * @public
     * @param {HTMLElement} el ҳ������Ԫ��
     */
    appendTo: function (el) {
        var wrap = new Element('div');
        wrap.id = this.wrapId;
        wrap.className = this.wrapClass;
        el.appendChild(wrap);
        
        this.renderHead(wrap);
        this.renderBody(wrap);
        this.appendTo = new Function();
    },
    
    /**
     * ���������ؼ�ͷ
     * 
     * @private
     * @param {HTMLElement} container �ؼ���������Ԫ��
     */
    renderHead: function (container) {
        var head = new Element('div');
        head.id = this.headId;
        head.className = this.headClass;
        container.append(head);
        
        var prevYear = new Element('div');
        prevYear.className = this.prevYearClass;
        head.append(prevYear);
        
        var prevMonth = new Element('div');
        prevMonth.className = this.prevMonthClass;
        head.append(prevMonth);
        
        var title = new Element('div');
        title.id = this.titleId;
        title.className = this.titleClass;
        title.innerHTML = this.getTitleHtml();
        head.append(title);
        
        var nextMonth = new Element('div');
        nextMonth.className = this.nextMonthClass;
        head.append(nextMonth);
        
        var nextYear = new Element('div');
        nextYear.className = this.nextYearClass;
        head.append(nextYear);
        
        head.onclick = this.getHeadClickHandler();
    },
    
    /**
     * ���������ؼ���
     * 
     * @private
     * @param {HTMLElement} container �ؼ���������Ԫ��
     */
    renderBody: function (container) {
        var body = new Element('div');
        body.className = this.bodyClass;
        body.id = this.bodyId;
        body.onclick = this.getBodyClickHandler();
        container.append(body);
        
        body.innerHTML = this.getBodyHtml();
    },
    
    /**
     * ��ȡ�ؼ�ͷ������¼����
     * 
     * @private
     * @return {Function} �ؼ�ͷ������¼����
     */
    getHeadClickHandler: function () {
        var me = this;
        return function (e) {
            e = e || window.event;
            var tar = e.srcElement || e.target;
            var vDate = new Date(me.viewDate);
            
            switch (tar.className) {
            case me.prevYearClass:
                vDate.setFullYear(me.viewDate.getFullYear() - 1);
                break;
            case me.prevMonthClass:
                vDate.setMonth(me.viewDate.getMonth() - 1);
                break;
            case me.nextMonthClass:
                vDate.setMonth(me.viewDate.getMonth() + 1);
                break;
            case me.nextYearClass:
                vDate.setFullYear(me.viewDate.getFullYear() + 1);
                break;
            }
            
            var val = me.onviewchange.call(me, vDate);
            if (val !== false) {
                me.viewDate = vDate;
                G(me.bodyId).innerHTML = me.getBodyHtml();
                G(me.titleId).innerHTML = me.getTitleHtml();
            }
        };
    },
    
    /**
     * ��ȡ�ؼ����������¼����
     * 
     * @private
     * @return {Function} �ؼ�ͷ������¼����
     */
    getBodyClickHandler: function () {
        var me = this;
        return function (e) {
            e = e || window.event;
            var tar = e.srcElement || e.target;
            var sign = tar.getAttribute('sign');
            if (sign == 'date') {
                var selDate = new Date(tar.getAttribute('y'),
                                        tar.getAttribute('m'),
                                        tar.getAttribute('d'));
                var reVal = me.onselect.call(me, selDate);
                if (!(reVal === false)) {
                    me.setDate(selDate);
                }
            }
        };
    },
    
    /**
     * ��ȡ�ؼ������html
     * 
     * @private
     * @return {String} �ؼ������html
     */
    getTitleHtml: function () {
        return '{0}��{1}��'.format(this.viewDate.getFullYear(), (this.viewDate.getMonth() + 1));
    },
    
    /**
     * ��ȡ�ؼ������html
     * 
     * @private
     * @return {String} �ؼ������html
     */
    getBodyHtml: function () {
        var theadHtml = this.getTHeadHtml();
        var tbodyHtml = this.getTBodyHtml();
        var tableTpl = '<table cellpadding="0" cellspacing="0" border="0"><thead>{0}</thead><tbody>{1}</tbody></table>';
        return tableTpl.format(theadHtml, tbodyHtml);
    },
    
    /**
     * ��ȡ�ؼ���ͷ�ܵ�html
     * 
     * @private
     * @return {String} �ؼ���ͷ�ܵ�html
     */
    getTHeadHtml: function () {
        var weekMap = ['��', 'һ', '��', '��', '��', '��', '��'];
        var headHtml = ['<tr>'];
        var headItemTpl = '<td sign="week">{0}</td>';
        for (var i = 0; i < 7; i++) {
            headHtml.push(headItemTpl.format(weekMap[i]));
        }
        headHtml.push('</tr>');
        return headHtml.join('');
    },
    
    /**
     * ��ȡ�ؼ��������html
     * 
     * @private
     * @return {String} �ؼ��������html
     */
    getTBodyHtml: function () {
        //ģ�����
        var dateTemplate = '<td sign="date" style="{4}" class="{3}" y="{2}" m="{1}" d="{0}">{0}</td>';
        var todayClass = 'calendar-today';
        var thisMonthClass = 'calendar-thismonth';
        var otherMonthClass = 'calendar-othermonth';
        
        //���ڱ���
        var viewDate = this.viewDate;
        var year = viewDate.getFullYear();
        var month = viewDate.getMonth();
        var date = viewDate.getDate();
        
        //ǰһ���µ�����
        var prevMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
        //ǰһ���µ�����
        var beforeMonthDays = Calendar.getDateCountByMonth(prevMonth);
        //���µ�����
        var days = Calendar.getDateCountByMonth(viewDate);
        //����html��ѭ����ʼ����
        var index = 0 - new Date(year, month, 1).getDay();
        
        //make html
        var currDate, currMonth, currYear, currClass, currStyle;
        if (this.dateStyle.constructor == String) {
            currStyle = this.dateStyle;
        }
        
        //�����ϸ��ºͱ��µ�����html
        var html = [];
        html.push('<tr>');
        for (var trTag = 0; index < days; index++, trTag++) {
            if (trTag > 0 && trTag % 7 === 0) {
                html.push('</tr><tr>');
            }
            
            if (index < 0) {
                currDate = beforeMonthDays + index + 1;
                currMonth = prevMonth.getMonth();
                currYear = prevMonth.getFullYear();
                currClass = otherMonthClass;
            } else {
                currDate = index + 1;
                currMonth = month;
                currYear = year;
                currClass = thisMonthClass;
                if (date == currDate &&
                    month == this.date.getMonth() &&
                    year == this.date.getFullYear()) {
                    currClass = todayClass;
                }
            }
            
            if (typeof this.dateStyle == 'function') {
                currStyle = this.dateStyle(new Date(currYear, currMonth, currDate)) || "";
            }

            html.push(dateTemplate.format(currDate, 
                                            currMonth, 
                                            currYear, 
                                            currClass, 
                                            (currClass == todayClass ? "" : currStyle)));
        }
        
        //�����¸��µ�����html
        currMonth = month + 1;
        currYear = year;
        if (currMonth > 11) {
            currMonth = 0;
            currYear++;
        }
        currClass = otherMonthClass;
        for (var i = trTag % 7, oriI = i; i > 0 && i < 7; i++) {
            currDate = i - oriI + 1;
            if (typeof this.dateStyle == 'function') {
                currStyle = this.dateStyle(new Date(currYear, currMonth, currDate)) || "";
            }
            html.push(dateTemplate.format(currDate, currMonth, currYear, currClass, currStyle));
        }
        html.push('</tr>');
        
        return html.join('');
    }
};

