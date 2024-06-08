import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.transactions)[":id"]["$delete"]
>;

export const useDeleteTransactions = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async (json) => {
      const response = await client.api.transactions[":id"]["$delete"]({
        param: { id },
      });
      return response.json();
    },
    onSuccess: () => {
      toast.success("Transaction Delete Successfully");
      queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summery"] });
    },
    onError: () => {
      toast.error("Failed to Delete an transaction");
    },
  });
  return mutation;
};
