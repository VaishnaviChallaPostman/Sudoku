const http = require("http");
const websocketServer = require("websocket").server;
const httpServer = http.createServer();
httpServer.listen(process.env.PORT || 5000 , ()=> console.log("Server Listening on Port 5000"))

var que_buff = []
var que_buff_res = []
var sol_buff = []
var fix_ind_buff = []
const g1 = [[1,1],[1,2],[1,3],[2,1],[2,2],[2,3],[3,1],[3,2],[3,3]]
const g2 = [[1,4],[1,5],[1,6],[2,4],[2,5],[2,6],[3,4],[3,5],[3,6]]
const g3 = [[1,7],[1,8],[1,9],[2,7],[2,8],[2,9],[3,7],[3,8],[3,9]]
const g4 = [[4,1],[4,2],[4,3],[5,1],[5,2],[5,3],[6,1],[6,2],[6,3]]
const g5 = [[4,4],[4,5],[4,6],[5,4],[5,5],[5,6],[6,4],[6,5],[6,6]]
const g6 = [[4,7],[4,8],[4,9],[5,7],[5,8],[5,9],[6,7],[6,8],[6,9]]
const g7 = [[7,1],[7,2],[7,3],[8,1],[8,2],[8,3],[9,1],[9,2],[9,3]]
const g8 = [[7,4],[7,5],[7,6],[8,4],[8,5],[8,6],[9,4],[9,5],[9,6]]
const g9 = [[7,7],[7,8],[7,9],[8,7],[8,8],[8,9],[9,7],[9,8],[9,9]]

const hard = [
    {
        "que":[[0,0,0,0,0,0,0,0,2],[0,0,0,0,0,0,9,4,0],[0,0,3,0,0,0,0,0,5],[0,9,2,3,0,5,0,7,4],[8,4,0,0,0,0,0,0,0],[0,6,7,0,9,8,0,0,0],[0,0,0,7,0,6,0,0,0],[0,0,0,9,0,0,0,2,0],[4,0,8,5,0,0,3,6,0]],
        "sol":[[6,8,4,1,5,9,7,3,2],[7,5,1,8,3,2,9,4,6],[9,2,3,6,7,4,1,8,5],[1,9,2,3,6,5,8,7,4],[8,4,5,2,1,7,6,9,3],[3,6,7,4,9,8,2,5,1],[2,3,9,7,4,6,5,1,8],[5,1,6,9,8,3,4,2,7],[4,7,8,5,2,1,3,6,9]],
        "fix_ind":[[1,9],[2,7],[2,8],[3,3],[3,9],[4,2],[4,3],[4,4],[4,6],[4,8],[4,9],[5,1],[5,2],[6,2],[6,3],[6,5],[6,6],[7,4],[7,6],[8,4],[8,8],[9,1],[9,3],[9,4],[9,7],[9,8]]
    },
    {
        "que":[[4,0,6,0,0,0,0,5,9],[0,0,0,0,4,0,2,0,0],[0,7,0,0,0,0,0,0,0],[0,0,5,9,1,0,0,6,0],[0,1,3,0,0,0,8,9,4],[0,0,0,2,0,0,0,0,1],[5,0,8,0,0,0,0,0,0],[0,0,0,0,3,0,0,0,8],[0,4,0,0,6,0,1,0,0]],
        "sol":[[4,3,6,1,2,8,7,5,9],[9,5,1,7,4,6,2,8,3],[8,7,2,3,5,9,4,1,6],[7,8,5,9,1,4,3,6,2],[2,1,3,6,7,5,8,9,4],[6,9,4,2,8,3,5,7,1],[5,2,8,4,9,1,6,3,7],[1,6,7,5,3,2,9,4,8],[3,4,9,8,6,7,1,2,5]],
        "fix_ind":[[1,1],[1,3],[1,8],[1,9],[2,5],[2,7],[3,2],[4,3],[4,4],[4,5],[4,8],[5,2],[5,3],[5,7],[5,8],[5,9],[6,4],[6,9],[7,1],[7,3],[8,5],[8,9],[9,2],[9,5],[9,7]]
    }
]
const med = [
    {
        "que":[[0,0,0,6,0,0,1,0,7],[3,0,0,0,1,0,0,0,8],[0,5,0,2,0,0,0,0,0],[0,0,0,0,0,1,0,0,6],[0,4,5,0,6,8,0,1,3],[0,6,0,3,0,5,0,0,0],[8,2,3,5,4,0,0,0,0],[0,0,7,1,0,0,6,0,0],[4,0,0,8,0,9,2,3,5]],
        "sol":[[9,8,4,6,5,3,1,2,7],[3,7,2,9,1,4,5,6,8],[6,5,1,2,8,7,3,4,9],[7,3,9,4,2,1,8,5,6],[2,4,5,7,6,8,9,1,3],[1,6,8,3,9,5,4,7,2],[8,2,3,5,4,6,7,9,1],[5,9,7,1,3,2,6,8,4],[4,1,6,8,7,9,2,3,5]],
        "fix_ind":[[1,4],[1,7],[1,9],[2,1],[2,5],[2,9],[3,2],[3,4],[4,6],[4,9],[5,2],[5,3],[5,5],[5,6],[5,8],[5,9],[6,2],[6,4],[6,6],[7,1],[7,2],[7,3],[7,4],[7,5],[8,3],[8,4],[8,7],[9,1],[9,4],[9,6],[9,7],[9,8],[9,9]]
    },
    {
        "que":[[0,0,0,7,0,0,8,0,0],[0,9,5,0,0,0,0,4,1],[0,0,0,0,0,1,2,0,0],[9,0,7,0,8,6,0,0,0],[8,0,3,0,4,5,9,0,0],[0,0,0,3,7,9,6,0,4],[0,8,0,4,0,0,0,0,6],[0,0,4,5,0,0,0,9,0],[0,1,2,8,0,0,0,7,5]],
        "sol":[[1,2,6,7,3,4,8,5,9],[3,9,5,6,2,8,7,4,1],[4,7,8,9,5,1,2,6,3],[9,4,7,1,8,6,5,3,2],[8,6,3,2,4,5,9,1,7],[2,5,1,3,7,9,6,8,4],[5,8,9,4,1,7,3,2,6],[7,3,4,5,6,2,1,9,8],[6,1,2,8,9,3,4,7,5]],
        "fix_ind":[[1,4],[1,7],[1,9],[2,2],[2,3],[2,8],[2,9],[3,6],[3,7],[4,1],[4,3],[4,5],[4,6],[5,1],[5,3],[5,5],[5,6],[5,7],[6,4],[6,5],[6,6],[6,7],[6,9],[7,2],[7,4],[7,9],[8,3],[8,4],[8,8],[9,2],[9,3],[9,4],[9,8],[9,9]]
    }
]
const easy = [
    {
        "que":[[8,0,0,9,3,0,0,0,2],[0,0,9,0,0,0,0,4,0],[7,0,2,1,0,0,9,6,0],[2,0,0,0,0,0,0,9,0],[0,6,0,0,0,0,0,7,0],[0,7,0,0,0,6,0,0,5],[0,2,7,0,0,8,4,0,6],[0,3,0,0,0,0,5,0,0],[5,0,0,0,6,2,0,0,8]],
        "sol":[[8,4,6,9,3,7,1,5,2],[3,1,9,6,2,5,8,4,7],[7,5,2,1,8,4,9,6,3],[2,8,5,7,1,3,6,9,4],[4,6,3,8,5,9,2,7,1],[9,7,1,2,4,6,3,8,5],[1,2,7,5,9,8,4,3,6],[6,3,8,4,7,1,5,2,9],[5,9,4,3,6,2,7,1,8]],
        "fix_ind":[[1,1],[1,4],[1,5],[1,9],[2,3],[2,8],[3,1],[3,3],[3,4],[3,7],[3,8],[4,1],[4,8],[5,2],[5,8],[6,2],[6,6],[6,9],[7,2],[7,3],[7,6],[7,7],[7,9],[8,2],[8,7],[9,1],[9,5],[9,6],[9,9]]
    },
    {
        "que":[[0,0,0,0,0,6,0,8,0],[0,0,9,1,0,5,3,7,2],[0,8,0,7,0,0,0,1,6],[0,0,0,0,0,0,0,3,4,],[0,0,0,3,5,1,0,0,0],[7,3,0,0,0,0,0,0,0],[6,1,0,0,0,8,0,2,0],[8,2,3,9,0,4,6,0,0],[0,7,0,6,0,0,0,0,0]],
        "sol":[[1,5,7,2,3,6,4,8,9],[4,6,9,1,8,5,3,7,2],[3,8,2,7,4,9,5,1,6],[5,9,1,8,6,7,2,3,4],[2,4,6,3,5,1,7,9,8],[7,3,8,4,9,2,1,6,5],[6,1,4,5,7,8,9,2,3],[8,2,3,9,1,4,6,5,7],[9,7,5,6,2,3,8,4,1]],
        "fix_ind":[[1,6],[1,8],[2,3],[2,4],[2,6],[2,7],[2,8],[2,9],[3,2],[3,4],[3,8],[3,9],[4,8],[4,9],[5,4],[5,5],[5,6],[6,1],[6,2],[7,1],[7,2],[7,6],[7,8],[8,1],[8,2],[8,3],[8,4],[8,6],[8,7],[9,2],[9,4]]
    }
]


var count_select_level = 0

const clients = {};

const wsServer = new websocketServer({
    "httpServer" : httpServer
})

wsServer.on("request", request =>{

    const connection = request.accept(null, request.origin);
    connection.on("open", ()=> console.log("Connection Opened!"))
    connection.on("close", ()=> {console.log("Connection Closed!")
    count_select_level=0})
    connection.on("message", message => {
        //console.log(count_select_level)
        //console.log(message.utf8Data)
        if(count_select_level === 0)
        {
            if (message.utf8Data === "1" || message.utf8Data === "2" || message.utf8Data === "3")
            {count_select_level = 1
                index= Math.floor(Math.random() *  2)

                if(message.utf8Data === "1")
                {
                    que_buff = easy[index].que
                    que_buff_res = JSON.stringify(easy[index].que)
                    
                    //console.log("*******"+que_buff_res)
                    sol_buff = easy[index].sol
                    fix_ind_buff = easy[index].fix_ind
                    connection.send("Here is your Sudoku Puzzle : \n"+parse(que_buff))
                    connection.send("Enter three comma seperated integers between 1 to 9 both inclusive namely row,column,value")

                    
                }
                else if(message.utf8Data === "2")
                {
                    que_buff = med[index].que
                    que_buff_res = JSON.stringify(med[index].que)
                    sol_buff = med[index].sol
                    fix_ind_buff = med[index].fix_ind
                    connection.send("Here is your Sudoku Puzzle : \n"+parse(que_buff))
                    connection.send("Enter three comma seperated integers between 1 to 9 both inclusive namely row,column,value")
                    
                }
                else
                {
                    que_buff = hard[index].que
                    que_buff_res = JSON.stringify(hard[index].que)
                    sol_buff = hard[index].sol
                    fix_ind_buff = hard[index].fix_ind
                    connection.send("Here is your Sudoku Puzzle : \n"+parse(que_buff))
                    connection.send("Enter three comma seperated integers between 1 to 9 both inclusive namely row,column,value")

                }
            }
            else
            {
                connection.send("Wrong input!  Please select your difficulty level : \n Enter 1 for Easy \n Enter 2 for Medium \n Enter 3 for Hard")
            }
        }
        else
        {var text = message.utf8Data
        var ar = text.split(',')
        if(ar.length!==3)
        {text = text.toLowerCase()
            if(text === "end")
            {
                count_select_level=0
                connection.send("You have given 'end'. The solution is : \n"+ parse(sol_buff))
                connection.close()
            }
            else if (text === "reset")
            {que_buff = JSON.parse(que_buff_res)
                //console.log(que_buff_res)
            connection.send("You gave 'reset'. Status reset successfully!! Current status : \n"+ parse(que_buff))
            }
            else
            {
                connection.send("Wrong input! Please enter three comma seperated integers between 1 to 9 both inclusive namely row,column,value")
            }
            
        }
        else
        {
            var r = ar[0]
            r = parseInt(r)
            var c = ar[1]
            c = parseInt(c)
            var v = ar[2]
            v = parseInt(v)
            if((r>=1 && r <= 9)&&(c>=1 && c <= 9)&&(v>=1 && v <= 9) )
            {
                var flag = 0
                //console.log(fix_ind_buff)
            for(let ind = 0;ind<fix_ind_buff.length;ind++)
            {
                
                if(r === fix_ind_buff[ind][0] && c === fix_ind_buff[ind][1])
                
                {
                    flag = 1
                    break
                }

            }
            if(flag ===1)
            {
                connection.send("You can't change the element at ( "+r+" , "+c+" ) Enter again!")
            }
            else
            { var inp = []
                inp.push(r)
                inp.push(c)
                console.log(inp)
                var g1_flag = 0
                var g2_flag = 0
                var g3_flag = 0
                var g4_flag = 0
                var g5_flag = 0
                var g6_flag = 0
                var g7_flag = 0
                var g8_flag = 0
                var g9_flag = 0
                console.log(g2)
                console.log("index finding" + g2.indexOf(inp))
               /* if(g1.indexOf(inp) !== -1)g1_flag = 1
                if(g2.indexOf(inp) !== -1)g2_flag = 1
                if(g3.indexOf(inp) !== -1)g3_flag = 1
                if(g4.indexOf(inp) !== -1)g4_flag = 1
                if(g5.indexOf(inp) !== -1)g5_flag = 1
                if(g6.indexOf(inp) !== -1)g6_flag = 1
                if(g7.indexOf(inp) !== -1)g7_flag = 1
                if(g8.indexOf(inp) !== -1)g8_flag = 1
                if(g9.indexOf(inp) !== -1)g9_flag = 1 */

                for(var temp = 0;temp<g1.length;temp++)
                {
                    if(g1[temp][0]===r && g1[temp][1]===c)
                    {
                        g1_flag = 1
                        break
                    }
                }
                for(var temp = 0;temp<g2.length;temp++)
                {
                    if(g2[temp][0]===r && g2[temp][1]===c)
                    {
                        g2_flag = 1
                        break
                    }
                }
                for(var temp = 0;temp<g3.length;temp++)
                {
                    if(g3[temp][0]===r && g3[temp][1]===c)
                    {
                        g3_flag = 1
                        break
                    }
                }
                for(var temp = 0;temp<g4.length;temp++)
                {
                    if(g4[temp][0]===r && g4[temp][1]===c)
                    {
                        g4_flag = 1
                        break
                    }
                }
                for(var temp = 0;temp<g5.length;temp++)
                {
                    if(g5[temp][0]===r && g5[temp][1]===c)
                    {
                        g5_flag = 1
                        break
                    }
                }
                for(var temp = 0;temp<g6.length;temp++)
                {
                    if(g6[temp][0]===r && g6[temp][1]===c)
                    {
                        g6_flag = 1
                        break
                    }
                }
                for(var temp = 0;temp<g7.length;temp++)
                {
                    if(g7[temp][0]===r && g7[temp][1]===c)
                    {
                        g7_flag = 1
                        break
                    }
                }
                for(var temp = 0;temp<g8.length;temp++)
                {
                    if(g8[temp][0]===r && g8[temp][1]===c)
                    {
                        g8_flag = 1
                        break
                    }
                }
                for(var temp = 0;temp<g9.length;temp++)
                {
                    if(g9[temp][0]===r && g9[temp][1]===c)
                    {
                        g9_flag = 1
                        break
                    }
                }
                
                var flags = []
                
                flags.push(g1_flag)
                flags.push(g2_flag)
                flags.push(g3_flag)
                flags.push(g4_flag)
                flags.push(g5_flag)
                flags.push(g6_flag)
                flags.push(g7_flag)
                flags.push(g8_flag)
                flags.push(g9_flag)
                console.log("******* flags"+flags)
                var grid = flags.indexOf(1)
                var same_or_not_row = 0
                var same_or_not_col = 0
                var same_or_not_grid = 0
                console.log("grid" + grid)
                for(var row_check = 0;row_check<9;row_check++)
                { if(que_buff[r-1][row_check] === v)
                    {
                        same_or_not_row = 1
                        break
                    }

                }
                for(var col_check = 0;col_check<9;col_check++)
                { if(que_buff[col_check][c-1] === v)
                    {
                        same_or_not_col = 1
                        break
                    }

                }
                if(grid === 0)
                {  for(var ind_grid = 0;ind_grid<g1.length;ind_grid++)
                    {
                        var g_row = g1[ind_grid][0]
                        var g_col = g1[ind_grid][1]
                        if(que_buff[g_row-1][g_col-1]===v)
                        {
                            same_or_not_grid = 1
                            break
                        }
                    }

                }
                else if (grid === 1)
                {for(var ind_grid = 0;ind_grid<g2.length;ind_grid++)
                    {
                        var g_row = g2[ind_grid][0]
                        var g_col = g2[ind_grid][1]
                        if(que_buff[g_row-1][g_col-1]===v)
                        {
                            same_or_not_grid = 1
                            break
                        }
                    }

                }
                else if (grid === 2)
                {for(var ind_grid = 0;ind_grid<g3.length;ind_grid++)
                    {
                        var g_row = g3[ind_grid][0]
                        var g_col = g3[ind_grid][1]
                        if(que_buff[g_row-1][g_col-1]===v)
                        {
                            same_or_not_grid = 1
                            break
                        }
                    }
                    
                }
                else if (grid === 3)
                {
                    for(var ind_grid = 0;ind_grid<g4.length;ind_grid++)
                    {
                        var g_row = g4[ind_grid][0]
                        var g_col = g4[ind_grid][1]
                        if(que_buff[g_row-1][g_col-1]===v)
                        {
                            same_or_not_grid = 1
                            break
                        }
                    }
                }
                else if (grid === 4)
                {
                    for(var ind_grid = 0;ind_grid<g5.length;ind_grid++)
                    {
                        var g_row = g5[ind_grid][0]
                        var g_col = g5[ind_grid][1]
                        if(que_buff[g_row-1][g_col-1]===v)
                        {
                            same_or_not_grid = 1
                            break
                        }
                    }
                    
                }
                else if (grid === 5)
                {
                    for(var ind_grid = 0;ind_grid<g6.length;ind_grid++)
                    {
                        var g_row = g6[ind_grid][0]
                        var g_col = g6[ind_grid][1]
                        if(que_buff[g_row-1][g_col-1]===v)
                        {
                            same_or_not_grid = 1
                            break
                        }
                    }
                }
                else if (grid === 6)
                {
                    for(var ind_grid = 0;ind_grid<g7.length;ind_grid++)
                    {
                        var g_row = g7[ind_grid][0]
                        var g_col = g7[ind_grid][1]
                        if(que_buff[g_row-1][g_col-1]===v)
                        {
                            same_or_not_grid = 1
                            break
                        }
                    }
                    
                }
                else if (grid === 7)
                {for(var ind_grid = 0;ind_grid<g8.length;ind_grid++)
                    {
                        var g_row = g8[ind_grid][0]
                        var g_col = g8[ind_grid][1]
                        if(que_buff[g_row-1][g_col-1]===v)
                        {
                            same_or_not_grid = 1
                            break
                        }
                    }
                    
                }
                else
                {
                    for(var ind_grid = 0;ind_grid<g9.length;ind_grid++)
                    {
                        var g_row = g9[ind_grid][0]
                        var g_col = g9[ind_grid][1]
                        if(que_buff[g_row-1][g_col-1]===v)
                        {
                            same_or_not_grid = 1
                            break
                        }
                    }
                }
                console.log("row,col,grid"+same_or_not_row+ " "+ same_or_not_col+ " "+ same_or_not_grid )
                if (same_or_not_row === 1)
                {
                    connection.send("Wrong input, The value "+v+ " is already present in the row "+ r+ " Please enter again/modify accordingly!")
                }
                else if (same_or_not_col === 1)
                {
                    connection.send("Wrong input, The value "+v+ " is already present in the column "+ c+ " Please enter again/modify accordingly!")
                }
                else if (same_or_not_grid === 1)
                {
                    connection.send("Wrong input, The value "+v+ " is already present in its 3 X 3 Sub Grid. Please enter again/modify accordingly!")
                }
                else
                {que_buff[r-1][c-1]=v
                    //console.log("$$$$$"+que_buff_res)
                    var res = validate(que_buff)
                    if(res === "yes")
                    {connection.send("Bravo! You are a genius! You did it! Sudoku! \n" + parse(sol_buff))
                    connection.close()}
                    else
                    {
                        connection.send("Current status : \n" + parse(que_buff))
                    }

                }
            }

            }
            else 
            {connection.send("Wrong input, values given are out of bound! Please enter three comma seperated integers between 1 to 9 both inclusive namely row,column,value")

            }
            

        }



        }
     


    })
    const clientId = guid();
    clients[clientId] = {
        "connection" : connection
    }

    /*const payLoad = {
        "method" : "connect", 
        "clientId" : clientId
    }

    connection.send(JSON.stringify(payLoad))*/
    connection.send("Let's start Sudoku! Please select your difficulty level : \n Enter 1 for Easy \n Enter 2 for Medium \n Enter 3 for Hard")
})



  const parse = (arr) => {
    let str = ""
  
    for (let i=0;i<3;i++)
    {
        for (let j=0;j<3;j++)
        {
            if(arr[i][j] !== 0)
            str+= arr[i][j] + " "
            else
            str+= "__"
            if((j+1)%3 !== 0)
            str+="|"
        }
        str+=" || "
        for (let j=3;j<6;j++)
        {
            if(arr[i][j] !== 0)
            str+= arr[i][j] + " "
            else
            str+= "__"
            if((j+1)%3 !== 0)
            str+="|"
        }
        str+=" || "
        for (let j=6;j<9;j++)
        {
            if(arr[i][j] !== 0)
            str+= arr[i][j] + " "
            else
            str+= "__"
            if((j+1)%3 !== 0)
            str+="|"
        }
        str+= "\n"

    }
    str += "_________||__________||_________\n"
    for (let i=3;i<6;i++)
    {
        for (let j=0;j<3;j++)
        {
            if(arr[i][j] !== 0)
            str+= arr[i][j] + " "
            else
            str+= "__"
            if((j+1)%3 !== 0)
            str+="|"
        }
        str+=" || "
        for (let j=3;j<6;j++)
        {
            if(arr[i][j] !== 0)
            str+= arr[i][j] + " "
            else
            str+= "__"
            if((j+1)%3 !== 0)
            str+="|"
        }
        str+=" || "
        for (let j=6;j<9;j++)
        {
            if(arr[i][j] !== 0)
            str+= arr[i][j] + " "
            else
            str+= "__"
            if((j+1)%3 !== 0)
            str+="|"
        }
        str+= "\n"
    }
        
    str += "_________||__________||_________\n"

    for (let i=6;i<9;i++)
    {
        for (let j=0;j<3;j++)
        {
            if(arr[i][j] !== 0)
            str+= arr[i][j] + " "
            else
            str+= "__"
            if((j+1)%3 !== 0)
            str+="|"
        }
        str+=" || "
        for (let j=3;j<6;j++)
        {
            if(arr[i][j] !== 0)
            str+= arr[i][j] + " "
            else
            str+= "__"
            if((j+1)%3 !== 0)
            str+="|"
        }
        str+=" || "
        for (let j=6;j<9;j++)
        {
            if(arr[i][j] !== 0)
            str+= arr[i][j] + " "
            else
            str+= "__"
            if((j+1)%3 !== 0)
            str+="|"
        }
        str+= "\n"

    }
    return str
  }

/* 
__|__|__ || __|__|__ || __|__|__  
__|__|__ || __|__|__ || __|__|__ 
__|__|__ || __|__|__ || __|__|__ 
_________||__________||_________
__|__|__ || __|__|__ || __|__|__  
__|__|__ || __|__|__ || __|__|__ 
__|__|__ || __|__|__ || __|__|__ 
_________||__________||_________
__|__|__ || __|__|__ || __|__|__  
__|__|__ || __|__|__ || __|__|__ 
__|__|__ || __|__|__ || __|__|__ 


*/
  



  
function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();


function validate(q)
{var flag = 0
    for (let i=0;i<9;i++)
    {
        for(let j=0;j<9;j++)
        {
            if(q[i][j]!==sol_buff[i][j])
            {
                flag = 1
                break
            }

        }
    }
    if(flag === 0)
    return "yes"
    else
    return "no"
}

