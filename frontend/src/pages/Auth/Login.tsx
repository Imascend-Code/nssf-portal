import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../../api/hooks";
import { useLocation, useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
type FormData = z.infer<typeof schema>;

export default function Login() {
  const { mutateAsync, isPending } = useLogin();
  const nav = useNavigate();
  const loc = useLocation() as any;
  const returnTo = loc?.state?.returnTo || "/dashboard";

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <form className="max-w-md mx-auto space-y-3" onSubmit={handleSubmit(async (values) => {
      await mutateAsync(values);
      nav(returnTo, { replace: true });
    })}>
      <h1 className="text-xl font-semibold">Sign in</h1>
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input {...register("email")} className="border rounded w-full p-2" aria-invalid={!!errors.email} />
        {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm mb-1">Password</label>
        <input type="password" {...register("password")} className="border rounded w-full p-2" aria-invalid={!!errors.password} />
        {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
      </div>
      <button disabled={isPending} className="border rounded px-3 py-2">{isPending ? "Signing in..." : "Sign in"}</button>
    </form>
  );
}
