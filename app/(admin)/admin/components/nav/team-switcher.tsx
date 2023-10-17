"use client"

import * as React from "react"
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSession } from "next-auth/react"
import { User } from "@prisma/client"
import { Election } from "@/lib/types/Election"



type Team = {
  label: string
  value: string
}

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface TeamSwitcherProps extends PopoverTriggerProps {}

export default function TeamSwitcher({ className }: TeamSwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false)
  const { data: session } = useSession()
  const [electionName, setElectionName] = React.useState("");
  const [electionDate, setElectionDate] = React.useState("");
  const [electionCampus, setElectionCampus] = React.useState("");
  const [groups, setGroups] = React.useState([
    {
      label: "Your elections",
      teams: [
        {
          label: "Not found",
          value: "not-found",
        }
      ],
    },
    {
      label: "Other elections",
      teams: [
        {
          label: "Not found",
          value: "not-found",
        }
      ],
    },
  ])
  const [selectedTeam, setSelectedTeam] = React.useState<Team>(
    groups[0].teams[0]
  )

  React.useEffect(() => {
    fetch('/api/admin/elections')
        .then(response => response.json())
        .then(data => {
            console.log('Data:', data)
            const yourElections = data.userElections.filter((election: Election) => election.managers.some((manager: any) => manager.id === session?.user.id));
            const otherElections = data.allElections.filter((election: Election) => !election.managers.some((manager: any) => manager.id === session?.user.id));
            
            setGroups([
                {
                    label: "Your elections",
                    teams: yourElections.map((election: any) => ({
                        label: election.label,
                        value: election.value,
                    })),
                },
                {
                    label: "Other elections",
                    teams: otherElections.map((election: any) => ({
                        label: election.label,
                        value: election.value,
                    })),
                },
            ]);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}, [session])

  
  const onSubmit = (event: any) => {
    event.preventDefault();

    const isoDate = `${electionDate}T00:00:00Z`; 
  
    fetch('/api/admin/elections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: electionName,
        campus: electionCampus,
        date: isoDate,
      }),
    })
    .then(response => response.json())
    .then(data => {
      // handle response data
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select an election"
            className={cn("w-[200px] justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/${selectedTeam.value}.png`}
                alt={selectedTeam.label}
              />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            {selectedTeam.label}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search election..." />
              <CommandEmpty>No team found.</CommandEmpty>
              {groups.map((group) => (
                <CommandGroup key={group.label} heading={group.label}>
                  {group.teams.map((team) => (
                    <CommandItem
                      key={team.value}
                      onSelect={() => {
                        setSelectedTeam(team)
                        setOpen(false)
                      }}
                      className="text-sm"
                    >
                      <Avatar className="mr-2 h-5 w-5">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${team.value}.png`}
                          alt={team.label}
                          className="grayscale"
                        />
                        <AvatarFallback>SC</AvatarFallback>
                      </Avatar>
                      {team.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedTeam.value === team.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false)
                      setShowNewTeamDialog(true)
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Election
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Election</DialogTitle>
          <DialogDescription>
            You will be redirected to the new election page, where you can manage the election.
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Election name</Label>
              <Input id="name" type="text" value={electionName} onChange={(e) => setElectionName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Campus</Label>
              <Input id="campus" type="text" value={electionCampus} onChange={(e) => setElectionCampus(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={electionDate} onChange={(e) => setElectionDate(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={onSubmit}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}