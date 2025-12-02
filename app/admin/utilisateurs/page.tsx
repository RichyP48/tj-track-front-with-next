"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { adminApi } from "@/lib/api/admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Check, X, UserCheck, Clock, Users } from "lucide-react"
import { toast } from "sonner"

const roleColors: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-800",
  MANAGER: "bg-blue-100 text-blue-800",
  COMMERCANT: "bg-green-100 text-green-800",
  FOURNISSEUR: "bg-orange-100 text-orange-800",
  LIVREUR: "bg-cyan-100 text-cyan-800",
  CLIENT: "bg-gray-100 text-gray-800",
}

export default function UtilisateursPage() {
  const queryClient = useQueryClient()

  const { data: allUsers, isLoading: loadingAll } = useQuery({
    queryKey: ["all-users"],
    queryFn: adminApi.getAllUsers,
  })

  const { data: pendingUsers, isLoading: loadingPending } = useQuery({
    queryKey: ["pending-users"],
    queryFn: adminApi.getPendingUsers,
  })

  const approveMutation = useMutation({
    mutationFn: (userId: string) => adminApi.approveUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] })
      queryClient.invalidateQueries({ queryKey: ["pending-users"] })
      toast.success("Utilisateur approuvé")
    },
    onError: () => {
      toast.error("Erreur lors de l'approbation")
    },
  })

  const rejectMutation = useMutation({
    mutationFn: (userId: string) => adminApi.rejectUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] })
      queryClient.invalidateQueries({ queryKey: ["pending-users"] })
      toast.success("Utilisateur rejeté")
    },
    onError: () => {
      toast.error("Erreur lors du rejet")
    },
  })

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground mt-1">Gérez les utilisateurs et les demandes d'inscription</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total utilisateurs</p>
                  <p className="text-2xl font-bold">{allUsers?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">En attente</p>
                  <p className="text-2xl font-bold text-amber-600">{pendingUsers?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Approuvés</p>
                  <p className="text-2xl font-bold text-green-600">
                    {allUsers?.filter((u) => u.isApproved).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">En attente ({pendingUsers?.length || 0})</TabsTrigger>
            <TabsTrigger value="all">Tous les utilisateurs ({allUsers?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Ville</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingPending ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Chargement...
                        </TableCell>
                      </TableRow>
                    ) : !pendingUsers?.length ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <Check className="h-8 w-8 mx-auto text-green-500 mb-2" />
                          <p className="text-muted-foreground">Aucune demande en attente</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingUsers.map((user) => (
                        <TableRow key={user.userId}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {user.roles?.map((role) => (
                                <Badge key={role} className={roleColors[role] || "bg-gray-100"}>
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{user.town || "-"}</TableCell>
                          <TableCell className="text-muted-foreground">{user.phoneNumber || "-"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                onClick={() => approveMutation.mutate(user.userId)}
                                disabled={approveMutation.isPending}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approuver
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="destructive" disabled={rejectMutation.isPending}>
                                    <X className="h-4 w-4 mr-1" />
                                    Rejeter
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmer le rejet</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Êtes-vous sûr de vouloir rejeter la demande de {user.name} ? Cette action est
                                      irréversible.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => rejectMutation.mutate(user.userId)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Rejeter
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Email vérifié</TableHead>
                      <TableHead>Ville</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingAll ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Chargement...
                        </TableCell>
                      </TableRow>
                    ) : !allUsers?.length ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Aucun utilisateur
                        </TableCell>
                      </TableRow>
                    ) : (
                      allUsers.map((user) => (
                        <TableRow key={user.userId}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {user.roles?.map((role) => (
                                <Badge key={role} className={roleColors[role] || "bg-gray-100"}>
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.isApproved ? (
                              <Badge className="bg-green-100 text-green-800">
                                <UserCheck className="h-3 w-3 mr-1" />
                                Approuvé
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-100 text-amber-800">
                                <Clock className="h-3 w-3 mr-1" />
                                En attente
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {user.isAccountVerified ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <X className="h-4 w-4 text-red-600" />
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{user.town || "-"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  )
}
