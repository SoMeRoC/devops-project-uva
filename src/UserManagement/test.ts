import { Context } from "@azure/functions"

function PrintSomething(context: Context){
    context.log("PRINT_SOMETHING");
}

export default PrintSomething;
