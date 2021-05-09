export const mimeToIcon = {
    'image': 'file-image-o',
    'audio': 'file-audio-o',
    'video': 'file-video-o',
    'application/pdf': 'file-pdf-o',
    'application/msword': 'file-word-o',
    'application/vnd.ms-word': 'file-word-o',
    'application/vnd.oasis.opendocument.text': 'file-word-o',
    'application/vnd.openxmlformats-officedocument.wordprocessingml': 'file-word-o',
    'application/vnd.ms-excel': 'file-excel-o',
    'application/vnd.openxmlformats-officedocument.spreadsheetml': 'file-excel-o',
    'application/vnd.oasis.opendocument.spreadsheet': 'file-excel-o',
    'application/vnd.ms-powerpoint': 'file-powerpoint-o',
    'application/vnd.openxmlformats-officedocument.presentationml': 'file-powerpoint-o',
    'application/vnd.oasis.opendocument.presentation': 'file-powerpoint-o',
    'text/plain': 'file-text-o',
    'text/html': 'file-code-o',
    'application/json': 'file-code-o',
    'application/gzip': 'file-archive-o',
    'application/zip': 'file-archive-o'
}
export const sampleQuestionAir=    {questionAir: [
    {label: 'Question', tag: 'input', type: 'text',value:"",id:0,
      skip: [{
        cond: '=',
        val: 'yes',
        questions: [1, 2]
      }]
    },

    {label: 'Second question', tag: 'textarea', placeholder: 'fill this',value:"",id:1,},

    {label: 'Another question', tag: 'radio',id:2, 
     data : [ 
      {'value': '1', 'label': 'option 1', checked:true},
      {'value': '2', 'label': 'option 2'},
      {'value': '3', 'label': 'option 3'}
     ],
     skip: [
      {val: '1', cond: '=', questions: [0]},
      {val: '2', cond: '=', questions: [1]},
   
     ],
     add:[{val: '3', cond: '=', qusetion:[2],newQuestions: [{label: 'extra quos', tag: 'textarea', placeholder: 'fill this',value:"",id:1,positionAfter:2,id:5}]}],
    },
    {label: 'You almost finish', tag: 'checkbox',id:3, data : [ 
      {'value': '4', 'label': 'option 4',checked:true},
      {'value': '5', 'label': 'option 5',checked:true},
      {'value': '6', 'label': 'option 6'}
    ]},
    {label: 'This is the last one', tag: 'textarea', value:'hgzhcxghj  kfjkfjd',id:4,}
  ]}
