"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { settings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { SettingScheme } from "@/schemas";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@prisma/client";
import { Switch } from "@/components/ui/switch";

const SettingsPage = () => {
  const user = useCurrentUser();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingScheme>>({
    resolver: zodResolver(SettingScheme),
    defaultValues: {
      name: user?.name || undefined,
      email: user.email || undefined,
      password: undefined,
      newPassword: undefined,
      role: user.role,
      isTwoFactorEnable: user.isTwoFactorEnabled || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof SettingScheme>) => {
    const {
      isTwoFactorEnable: isTwoFactorEnabled,
      password,
      newPassword,
      role,
      email,
      name,
    } = values;
    const newValues = {
      isTwoFactorEnabled,
      password,
      newPassword,
      role,
      email,
      name,
    };

    startTransition(async () => {
      try {
        const data = await settings(newValues);

        if (data.error) {
          setError(data.error);
        }

        if (data.success) {
          await update();
          setSuccess(data.success);
        }
      } catch (e) {
        setError("Something went wrong");
      }
    });
  };

  return (
    <Card className={"w-[600px]"}>
      <CardHeader>
        <p className={"text-2xl font-semibold text-center"}>⚙️ Settings</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={"space-y-6"}>
            <div className={"space-y-4"}>
              <FormField
                name={"name"}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={"John Doe"}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {user?.isOAuth === false && (
                <>
                  <FormField
                    name={"email"}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type={"email"}
                            placeholder={"example@email.com"}
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={"password"}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type={"password"}
                            placeholder={"******"}
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={"newPassword"}
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type={"password"}
                            placeholder={"******"}
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                name={"role"}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={"Select a role"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                        <SelectItem value={UserRole.USER}>User</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {user?.isOAuth === false && (
                <FormField
                  name={"isTwoFactorEnable"}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem
                      className={
                        "flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"
                      }
                    >
                      <div>
                        <FormLabel>Two Factor Authentication</FormLabel>
                        <FormDescription>
                          Enable two factor authentication for your account
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          disabled={isPending}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type={"submit"}>Save</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SettingsPage;
