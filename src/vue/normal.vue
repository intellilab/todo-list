<template>
    <div class="normal">
        <div class="status">
            <div class="left">To-do List</div>
            <div class="right">
                <i v-text="months[current.month]"></i>
                <i v-text="current.year"></i>
                <i class="fa fa-caret-left" @click="prev"></i><i class="fa fa-caret-right" @click="next"></i>
                <i class="fa fa-refresh" @click="refresh"></i>
            </div>
        </div>
        <div class="calendar">
            <ul class="week">
                <li v-for="x in weeks" v-text="x"></li>
            </ul>
            <div class="date">
                <ul class="col"
                    v-for="($w, week) in date.weeks"
                >
                    <li v-for="($d, day) in week" :
                        :class="{'enable': day.day != '-'}"
                        @click.stop="handle($event, 'click-day', day.day, $w, $d, day.star)"
                    ><i
                        :class="{'today': day.flag, 'hide': day.day == '-'}"
                        v-text="day.day"
                    ></i><i class="fa fa-star" v-show="day.star"></i></li>
                </ul>
            </div>
        </div>
        <div class="mask">
            <div class="panel">
                <h3>
                    <i v-text="current.year"></i>
                    <i>-</i>
                    <i v-text="current.month + 1 < 10 ? '0' + (current.month + 1) : current.month + 1"></i>
                    <i>-</i>
                    <i v-text="current.day < 10 ? '0' + current.day : current.day"></i>
                </h3>
                <label class="in-box input"><input type="text" placeholder="标题"
                    v-model="task.in.title" maxlength="20"
                    @focus="handle($event, 'focus-input')"
                    @blur="handle($event, 'blur-input')"
                ><i v-text="task.out.title"></i></label>
                <label class="in-box textarea"><textarea placeholder="写点什么..."
                    v-model="task.in.content"
                    @focus="handle($event, 'focus-input')"
                    @blur="handle($event, 'blur-input')"
                ></textarea><i v-html="task.out.content"></i></label>
                <div class="btn-box editor">
                    <button class="cancel"
                        @click="handle($event, 'click-btn', 'cancel')"
                    >取消</button><button class="ok"
                        @click="handle($event, 'click-btn', 'ok')"
                    >确定</button>
                </div>
                <div class="btn-box show">
                    <button class="cancel"
                        @click="handle($event, 'click-btn', 'delete')"
                    >删除</button><button class="ok"
                        @click="handle($event, 'click-btn', 'editor')"
                    >编辑</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                panel: null,
                mask: null,
                db: null,
                store: null,
                weeks: [
                    'Monday', 'Tuesday',
                    'Wednesday', 'Thursday',
                    'Friday', 'Saturday', 'Sunday'
                ],
                months: [
                    'Jan.', 'Feb.', 'Mar.', 'Apr.',
                    'May.', 'Jun.', 'Jul.', 'Aug.',
                    'Sep.', 'Oct.', 'Nov.', 'Dec.'
                ],
                current: {
                    year: null,
                    month: null,
                    day: null,
                    week: null
                },
                today: {
                    year: null,
                    month: null,
                    day: null,
                    week: null
                },

                date: {
                    weeks: [
                        [], [], [],
                        [], [], [],
                        []
                    ]
                },
                indices: {week: 0, day: 0},
                task: {
                    in: {
                        title: '',
                        content: '',

                    },
                    out: {
                        title: '',
                        content: '',
                        id: ''
                    },
                    // 当前月的任务列表
                    years: []
                },
            }
        },
        methods: {
            init() {
                const today = new Date()
                this.today.year =
                    this.current.year = today.getFullYear()
                this.today.month =
                    this.current.month = today.getMonth()
                this.today.day =
                    this.current.day = today.getDate()
                this.today.week =
                    this.current.week = today.getDay()
            },
            isToday(date) {
                return this.today.year == date.getFullYear() &&
                    this.today.month == date.getMonth() &&
                    this.today.day == date.getDate()
            },
            getTasks(year) {
                if (!this.store) {
                    alert('很抱歉，我的内心不配我的外表。')
                    return
                }
                const index = this.store.index('year')
                // 开始之前清空已有数据
                this.task.years = []
                if (index) {
                    const range = IDBKeyRange.only(year)
                    index.openCursor(range).onsuccess = e => {
                        const cursor = e.target.result
                        if (cursor) {
                            cursor.value.content =
                                cursor.value.content.replace(/\n/g, '<br>')
                            this.task.years.push(cursor.value)
                            cursor.continue()
                        } this.render() // 获取数据结束即渲染
                    }
                } else alert('很抱歉，我的内心不配我的外表。')
            },
            render() {

                const date = new Date(this.current.year,
                    this.current.month, 1)
                let
                    index = date.getDay() - 1,
                    i = 0

                this.clear()
                index < 0 ? index = 6 : null
                this.date.weeks[index].push({
                    day: date.getDate(),
                    flag: false,
                    star: false
                })

                // 前向填充
                while (i < index) {
                    this.date.weeks[i].push({
                        day: '-',
                        flag: false,
                        star: false
                    })

                    i++
                }
                // 循环填充
                while (true) {
                    date.setDate(date.getDate() + 1)
                    if (date.getMonth() !== this.current.month) break
                    index = date.getDay() - 1
                    index < 0 ? index = 6 : null
                    this.date.weeks[index].push({
                        day: date.getDate(),
                        flag: this.isToday(date),
                        star: false
                    })
                }
                // 后向填充
                while (index < 6) {
                    this.date.weeks[++index].push({
                        day: '-',
                        flag: false,
                        star: false
                    })
                }
                /*
                * 日历渲染结束
                * 遍历任务列表
                */
                this.task.years.forEach(e => {
                    if (e.month === this.current.month)
                        this.date.weeks[e.indices.week][e.indices.day].star = true
                })
                this.date.weeks = this.date.weeks

            },
            clear() {
                for (let i = 0; i < this.date.weeks.length; i++)
                    this.date.weeks.$set(i, [])
            },
            prev() {
                if (this.current.month == 0) {
                    this.current.month = 11
                    this.getTasks(--this.current.year)
                } else {
                    this.current.month--
                    this.render()
                }
            },
            next() {
                if (this.current.month == 11) {
                    this.current.month = 0
                    this.getTasks(++this.current.year)
                } else {
                    this.current.month++
                    this.render()
                }
            },
            refresh() {
                this.current.year = this.today.year
                this.current.month = this.today.month
                this.current.day = this.today.day
                this.getTasks(this.current.year)
            },
            handle(e, type, ...args) {
                switch (type) {
                    case 'click-day':
                        {
                            if (args[0] == '-') return
                            this.current.day = args[0]
                            this.indices.week = args[1]
                            this.indices.day = args[2]
                            if (args[3]) {
                                this.task.years.forEach(e => {
                                    if (e.year == this.current.year &&
                                        e.month == this.current.month &&
                                        e.day == this.current.day) {
                                        this.task.out.title = e.title
                                        this.task.out.content = e.content
                                        this.task.out.id = e.date
                                    }
                                })
                                this.mask.classList.add('show')
                            } else this.mask.classList.add('editor')
                        }
                        break
                    case 'focus-input':
                        {
                            e.target.parentElement.classList.add('focus')
                        }
                        break
                    case 'blur-input':
                        {
                            e.target.parentElement.classList.remove('focus')
                        }
                        break
                    case 'click-btn':
                        {
                            if (args.length && args[0] == 'cancel') {
                                this.mask.classList.remove('editor')
                            }
                            if (args.length && args[0] == 'ok') {
                                if (/^\s*$/.test(this.task.content)) {
                                    alert('没写内容是不会提交的……')
                                    return
                                }
                                const week = this.date.weeks[this.indices.week]
                                week[this.indices.day].star = true
                                this.date.weeks.$set(this.indices.week, week)
                                if (this.store) {
                                    this.store.put({
                                        date: `${this.current.year}${this.current.month + 1 < 10 ? '0' + (this.current.month + 1) : this.current.month + 1}${this.current.day < 10 ? '0' + (this.current.day) : this.current.day}`,
                                        year: this.current.year,
                                        month: this.current.month,
                                        day: this.current.day,
                                        title: this.task.in.title,
                                        content: this.task.in.content,
                                        indices: this.indices
                                    }).then(results => {
                                        if (results.err) {
                                            alert('提交遇到问题了')
                                            console.log(results.err)
                                        } else {
                                            this.mask.classList.remove('editor')
                                            this.getTasks(this.current.year)
                                        }
                                    })
                                    // 提交后清除记录
                                    this.task.in.title =
                                        this.task.in.content = ''

                                }
                            }
                            if (args.length && args[0] == 'editor') {
                                this.task.in.title = this.task.out.title
                                this.task.in.content = this.task.out.content
                                    .replace(/<br>/g, '\n')
                                this.mask.classList.remove('show')
                                this.mask.classList.add('editor')
                            }
                            if (args.length && args[0] == 'delete') {
                                if (window.confirm('确认删除？')) {
                                    this.store.delete(this.task.out.id).then(results => {
                                        if (!results.err) {
                                            alert('删除成功')
                                            this.getTasks(this.current.year)
                                            this.mask.classList.remove('show')
                                        } else {
                                            alert('删除失败')
                                            console.log(results.err)
                                        }
                                    })
                                }
                            }
                        }
                        break
                    default:
                        break
                }
            },
            run() {
                this.getTasks((new Date()).getFullYear())
                this.init()
                this.panel = document.querySelector('.panel')
                this.mask = document.querySelector('.mask')
                document.addEventListener('click', e => {
                    if (e.target !== this.panel && !this.panel.contains(e.target))
                        this.mask.classList.remove('show', 'editor')
                })
            }
        },
        ready() {

            Flex.open('todo-list').then(results => {
                if (results.err) {
                    alert('很抱歉，我的内心不配我的外表。')
                    console.log(results.err)
                } else {
                    this.db = results.db
                    this.store = this.db.getStore('task')
                    if (!this.store) {
                        this.db.createStore('task', {keyPath: 'date', autoIncrement: true})
                            .then(results => {
                                if (results.err) {
                                    alert('很抱歉，我的内心不配我的外表。')
                                    console.log(results.err)
                                } else {
                                    this.store = results.store
                                    this.store.createIndex([
                                        {name: 'year', key: 'year', opts: {unique: false}}
                                    ]).then(results => {
                                        if (results.err) {
                                            alert('很抱歉，我的内心不配我的外表。')
                                            console.log(results.err)
                                        } else this.run()
                                    })
                                }
                            })
                    } else this.run()
                }
            })

        }
    }
</script>