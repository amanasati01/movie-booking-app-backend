class ApiResponse{
    statusCode : number;
    data : any;
    success : number
    message : string
    constructor(
        statusCode : number,
        data : string,
        message : string = "Success",
    ){
        this.statusCode = statusCode,
        this.data = data,
        this.message = message,
        this.success = statusCode
    }
}